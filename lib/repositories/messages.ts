import { messages } from "@/data/mock-data";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { Message, MessageTemplatePayload } from "@/types/domain";
import type { Database, Json } from "@/types/supabase";

const templateCategoryMap: Partial<Record<Message["category"], Message["templateType"]>> = {
  ご飯: "meal",
  買い物: "shopping",
  家事: "chore",
  予定: "schedule",
  "部活・習い事": "activity"
};

function formatTime(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));
}

function parseTemplatePayload(payload: Json | null): MessageTemplatePayload | undefined {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return undefined;
  }

  const record = payload as Record<string, Json>;

  if (typeof record.title !== "string" || !Array.isArray(record.fields)) {
    return undefined;
  }

  const fields = record.fields.flatMap((field) => {
    if (!field || typeof field !== "object" || Array.isArray(field)) {
      return [];
    }

    const item = field as Record<string, Json>;

    if (typeof item.label !== "string" || typeof item.value !== "string") {
      return [];
    }

    return [{ label: item.label, value: item.value }];
  });

  return {
    title: record.title,
    fields
  };
}

function serializeTemplatePayload(payload?: MessageTemplatePayload): Json | null {
  if (!payload) {
    return null;
  }

  return {
    title: payload.title,
    fields: payload.fields.map((field) => ({
      label: field.label,
      value: field.value
    }))
  };
}

export async function listMessages(familyId?: string): Promise<Message[]> {
  const context = await getCurrentAppContext();
  const resolvedFamilyId = familyId ?? context.familyId;

  if (!resolvedFamilyId) {
    return [];
  }

  if (isSupabaseConfigured()) {
    const supabase = await createClient();

    const { data: messageRows, error: messageError } = await supabase
      .from("messages")
      .select("id, family_id, author_id, category, body, payload, created_at")
      .eq("family_id", resolvedFamilyId)
      .order("created_at", { ascending: false })
      .returns<
        Pick<
          Database["public"]["Tables"]["messages"]["Row"],
          "id" | "family_id" | "author_id" | "category" | "body" | "payload" | "created_at"
        >[]
      >();

    if (messageError) {
      throw messageError;
    }

    const { data: readRows, error: readsError } = await supabase
      .from("message_reads")
      .select("message_id, user_id")
      .in(
        "message_id",
        (messageRows ?? []).map((message) => message.id)
      )
      .returns<Pick<Database["public"]["Tables"]["message_reads"]["Row"], "message_id" | "user_id">[]>();

    if (readsError) {
      throw readsError;
    }

    const readMap = new Map<string, string[]>();
    for (const row of readRows ?? []) {
      readMap.set(row.message_id, [...(readMap.get(row.message_id) ?? []), row.user_id]);
    }

    return (messageRows ?? []).map((message) => {
      const templatePayload = parseTemplatePayload(message.payload);
      return {
        id: message.id,
        familyId: message.family_id,
        authorId: message.author_id,
        category: message.category as Message["category"],
        body: message.body,
        createdAt: formatTime(message.created_at),
        readBy: readMap.get(message.id) ?? [],
        templateType: templatePayload ? templateCategoryMap[message.category as Message["category"]] : undefined,
        templatePayload
      };
    });
  }

  return messages
    .filter((message) => message.familyId === resolvedFamilyId)
    .map((message) => ({
      ...message,
      templateType: message.templatePayload ? templateCategoryMap[message.category] : message.templateType
    }));
}

export async function createMessage(input: {
  familyId: string;
  authorId: string;
  category: Message["category"];
  body: string;
  templatePayload?: MessageTemplatePayload;
}) {
  if (!isSupabaseConfigured()) {
    return { mode: "demo" as const, id: `message-${Date.now()}`, payload: serializeTemplatePayload(input.templatePayload) };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .insert({
      family_id: input.familyId,
      author_id: input.authorId,
      category: input.category,
      body: input.body,
      payload: serializeTemplatePayload(input.templatePayload)
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) {
    throw error ?? new Error("Failed to create message");
  }

  return { mode: "supabase" as const, id: data.id };
}

export async function markMessagesAsRead(input: { messageIds: string[]; userId: string }) {
  const messageIds = Array.from(new Set(input.messageIds)).filter(Boolean);

  if (messageIds.length === 0) {
    return { mode: "supabase" as const };
  }

  if (!isSupabaseConfigured()) {
    return { mode: "demo" as const, ids: messageIds, userId: input.userId };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("message_reads").upsert(
    messageIds.map((messageId) => ({
      message_id: messageId,
      user_id: input.userId
    })),
    {
      onConflict: "message_id,user_id"
    }
  );

  if (error) {
    throw error;
  }

  return { mode: "supabase" as const };
}
