"use server";

import { revalidatePath } from "next/cache";
import { addDiaryReaction, createDiaryEntry } from "@/lib/repositories/diary";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { DiaryEntry } from "@/types/domain";

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

const moods: DiaryEntry["mood"][] = ["にこにこ", "おだやか", "がんばった", "つかれた", "しんぱい"];

export async function createDiaryEntryAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const mood = normalizeText(formData.get("mood")) as DiaryEntry["mood"];
  const visibility = normalizeText(formData.get("visibility")) as DiaryEntry["visibility"];
  const todayStory = normalizeText(formData.get("todayStory"));

  if (!todayStory || !moods.includes(mood)) {
    return;
  }

  await createDiaryEntry({
    familyId: context.familyId,
    authorId: context.appUserId,
    mood,
    visibility: visibility === "guardians" || visibility === "private" ? visibility : "family",
    todayStory,
    happyMoment: normalizeText(formData.get("happyMoment")),
    concern: normalizeText(formData.get("concern")),
    messageToFamily: normalizeText(formData.get("messageToFamily"))
  });

  revalidatePath("/diary");
  revalidatePath("/home");
  revalidatePath(`/rooms/${context.familyId}`);
}

export async function addDiaryReactionAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const entryId = normalizeText(formData.get("entryId"));
  const emoji = normalizeText(formData.get("emoji"));

  if (!entryId || !emoji) {
    return;
  }

  await addDiaryReaction({
    entryId,
    userId: context.appUserId,
    emoji
  });

  revalidatePath("/diary");
  revalidatePath(`/rooms/${context.familyId}`);
}
