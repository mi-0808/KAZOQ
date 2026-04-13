"use server";

import { revalidatePath } from "next/cache";
import { createMessage } from "@/lib/repositories/messages";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { Message, MessageTemplatePayload } from "@/types/domain";

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

const messageCategories: Message["category"][] = ["雑談", "ご飯", "買い物", "家事", "予定", "部活・習い事"];

function parseTemplatePayload(formData: FormData): MessageTemplatePayload | undefined {
  const title = normalizeText(formData.get("templateTitle"));
  const rawFields = normalizeText(formData.get("templateFields"));

  if (!title || !rawFields) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(rawFields) as Array<{ label?: string; value?: string }>;
    const fields = parsed.flatMap((field) => {
      if (!field || typeof field.label !== "string" || typeof field.value !== "string") {
        return [];
      }

      return [{ label: field.label, value: field.value }];
    });

    if (fields.length === 0) {
      return undefined;
    }

    return { title, fields };
  } catch {
    return undefined;
  }
}

export async function createMessageAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const category = normalizeText(formData.get("category")) as Message["category"];
  const body = normalizeText(formData.get("body"));

  if (!body || !messageCategories.includes(category)) {
    return;
  }

  await createMessage({
    familyId: context.familyId,
    authorId: context.appUserId,
    category,
    body,
    templatePayload: parseTemplatePayload(formData)
  });

  revalidatePath("/home");
  revalidatePath(`/rooms/${context.familyId}`);
  revalidatePath("/messages");
}
