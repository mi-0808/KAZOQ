"use server";

import { revalidatePath } from "next/cache";
import { createSchedule, updateSchedule } from "@/lib/repositories/calendar";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { ScheduleItem } from "@/types/domain";

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function combineDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00+09:00`).toISOString();
}

function isValidType(value: string): value is ScheduleItem["type"] {
  return value === "家族" || value === "個人";
}

export async function createScheduleAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const title = normalizeText(formData.get("title"));
  const date = normalizeText(formData.get("date"));
  const startTime = normalizeText(formData.get("startTime"));
  const endTime = normalizeText(formData.get("endTime"));
  const type = normalizeText(formData.get("type"));

  if (!title || !date || !startTime || !endTime || !isValidType(type)) {
    return;
  }

  await createSchedule({
    familyId: context.familyId,
    title,
    type,
    startsAt: combineDateTime(date, startTime),
    endsAt: combineDateTime(date, endTime),
    ownerId: normalizeText(formData.get("ownerId")) || undefined,
    placeId: normalizeText(formData.get("placeId")) || undefined,
    note: normalizeText(formData.get("note")) || undefined
  });

  revalidatePath("/calendar");
  revalidatePath("/home");
  revalidatePath(`/rooms/${context.familyId}`);
}

export async function updateScheduleAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const scheduleId = normalizeText(formData.get("scheduleId"));
  const title = normalizeText(formData.get("title"));
  const date = normalizeText(formData.get("date"));
  const startTime = normalizeText(formData.get("startTime"));
  const endTime = normalizeText(formData.get("endTime"));
  const type = normalizeText(formData.get("type"));

  if (!scheduleId || !title || !date || !startTime || !endTime || !isValidType(type)) {
    return;
  }

  await updateSchedule({
    scheduleId,
    title,
    type,
    startsAt: combineDateTime(date, startTime),
    endsAt: combineDateTime(date, endTime),
    ownerId: normalizeText(formData.get("ownerId")) || undefined,
    placeId: normalizeText(formData.get("placeId")) || undefined,
    note: normalizeText(formData.get("note")) || undefined
  });

  revalidatePath("/calendar");
  revalidatePath("/home");
  revalidatePath(`/rooms/${context.familyId}`);
}
