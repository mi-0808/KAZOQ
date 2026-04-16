import { diaryEntries } from "@/data/mock-data";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { getFamilyPreferences } from "@/lib/repositories/family-preferences";
import { getProfileBoardData } from "@/lib/repositories/profiles";
import { DiaryEntry, Profile } from "@/types/domain";
import type { Database } from "@/types/supabase";

export interface DiaryBoardData {
  entries: DiaryEntry[];
  profiles: Profile[];
  defaultVisibility: DiaryEntry["visibility"];
}

export async function getDiaryBoardData(): Promise<DiaryBoardData> {
  const context = await getCurrentAppContext();
  const [profileBoard, preferences] = await Promise.all([getProfileBoardData(context.familyId), getFamilyPreferences(context.familyId)]);

  if (isSupabaseConfigured() && context.familyId) {
    const supabase = await createClient();
    const { data: entriesData, error: entriesError } = await supabase
      .from("diary_entries")
      .select("id, family_id, author_id, mood, visibility_scope, today_story, happy_moment, concern, message_to_family, created_at")
      .eq("family_id", context.familyId)
      .order("created_at", { ascending: false })
      .returns<
        Pick<
          Database["public"]["Tables"]["diary_entries"]["Row"],
          | "id"
          | "family_id"
          | "author_id"
          | "mood"
          | "visibility_scope"
          | "today_story"
          | "happy_moment"
          | "concern"
          | "message_to_family"
          | "created_at"
        >[]
      >();

    if (entriesError) {
      throw entriesError;
    }

    const entryIds = (entriesData ?? []).map((entry) => entry.id);
    const { data: reactions, error: reactionsError } = entryIds.length
      ? await supabase
          .from("diary_reactions")
          .select("id, entry_id, user_id, emoji")
          .in("entry_id", entryIds)
          .returns<Pick<Database["public"]["Tables"]["diary_reactions"]["Row"], "id" | "entry_id" | "user_id" | "emoji">[]>()
      : { data: [], error: null };

    if (reactionsError) {
      throw reactionsError;
    }

    return {
      entries: (entriesData ?? []).map((entry) => ({
        id: entry.id,
        familyId: entry.family_id,
        authorId: entry.author_id,
        date: new Intl.DateTimeFormat("ja-JP", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit"
        }).format(new Date(entry.created_at)),
        mood: entry.mood as DiaryEntry["mood"],
        visibility: (entry.visibility_scope ?? preferences.diaryVisibility) as DiaryEntry["visibility"],
        todayStory: entry.today_story,
        happyMoment: entry.happy_moment ?? "",
        concern: entry.concern ?? "",
        messageToFamily: entry.message_to_family ?? "",
        reactions: (reactions ?? [])
          .filter((reaction) => reaction.entry_id === entry.id)
          .map((reaction) => ({
            id: reaction.id,
            entryId: reaction.entry_id,
            userId: reaction.user_id,
            emoji: reaction.emoji
          }))
      })),
      profiles: profileBoard.profiles,
      defaultVisibility: preferences.diaryVisibility
    };
  }

  return {
    entries: diaryEntries.filter((entry) => entry.familyId === context.familyId),
    profiles: profileBoard.profiles,
    defaultVisibility: preferences.diaryVisibility
  };
}

export async function createDiaryEntry(input: {
  familyId: string;
  authorId: string;
  mood: DiaryEntry["mood"];
  visibility: DiaryEntry["visibility"];
  todayStory: string;
  happyMoment: string;
  concern: string;
  messageToFamily: string;
}) {
  if (!isSupabaseConfigured()) {
    return { mode: "demo" as const, id: `diary-${Date.now()}`, input };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diary_entries")
    .insert({
      family_id: input.familyId,
      author_id: input.authorId,
      mood: input.mood,
      visibility_scope: input.visibility,
      today_story: input.todayStory,
      happy_moment: input.happyMoment || null,
      concern: input.concern || null,
      message_to_family: input.messageToFamily || null
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) {
    throw error ?? new Error("Failed to create diary entry");
  }

  return { mode: "supabase" as const, id: data.id };
}

export async function addDiaryReaction(input: { entryId: string; userId: string; emoji: string }) {
  if (!isSupabaseConfigured()) {
    return { mode: "demo" as const, id: `reaction-${Date.now()}`, input };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("diary_reactions")
    .insert({
      entry_id: input.entryId,
      user_id: input.userId,
      emoji: input.emoji
    })
    .select("id")
    .single<{ id: string }>();

  if (error || !data) {
    throw error ?? new Error("Failed to add diary reaction");
  }

  return { mode: "supabase" as const, id: data.id };
}
