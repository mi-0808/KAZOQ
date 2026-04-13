import { diaryEntries as mockDiaryEntries, profiles as mockProfiles } from "@/data/mock-data";
import { createClient } from "@/lib/supabase/server";
import { shouldUseDemoData } from "@/lib/config";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { getProfileBoardData } from "@/lib/repositories/profiles";
import { DiaryEntry, Profile } from "@/types/domain";
import type { Database } from "@/types/supabase";

export interface DiaryBoardData {
  entries: DiaryEntry[];
  profiles: Profile[];
}

function formatEntryDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

export async function getDiaryBoardData(): Promise<DiaryBoardData> {
  if (await shouldUseDemoData()) {
    return {
      entries: mockDiaryEntries,
      profiles: mockProfiles
    };
  }

  const context = await getCurrentAppContext();
  const supabase = await createClient();
  const [entriesResult, profileBoard] = await Promise.all([
    supabase
      .from("diary_entries")
      .select("id, family_id, author_id, mood, today_story, happy_moment, concern, message_to_family, created_at")
      .eq("family_id", context.familyId)
      .order("created_at", { ascending: false })
      .returns<
        Pick<
          Database["public"]["Tables"]["diary_entries"]["Row"],
          "id" | "family_id" | "author_id" | "mood" | "today_story" | "happy_moment" | "concern" | "message_to_family" | "created_at"
        >[]
      >(),
    getProfileBoardData(context.familyId)
  ]);

  if (entriesResult.error) {
    throw entriesResult.error;
  }

  const entryIds = (entriesResult.data ?? []).map((entry) => entry.id);
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
    entries: (entriesResult.data ?? []).map((entry) => ({
      id: entry.id,
      familyId: entry.family_id,
      authorId: entry.author_id,
      date: formatEntryDate(entry.created_at),
      mood: entry.mood as DiaryEntry["mood"],
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
    profiles: profileBoard.profiles
  };
}
