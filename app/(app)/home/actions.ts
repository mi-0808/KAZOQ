"use server";

import { revalidatePath } from "next/cache";
import { createFamilyTask, updateFamilyTaskStatus } from "@/lib/repositories/tasks";
import { getCurrentAppContext } from "@/lib/repositories/app-context";

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function createFamilyTaskAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const title = normalizeText(formData.get("title"));

  if (!title) {
    return;
  }

  await createFamilyTask({
    familyId: context.familyId,
    createdBy: context.appUserId,
    assigneeId: normalizeText(formData.get("assigneeId")) || undefined,
    title,
    note: normalizeText(formData.get("note")) || undefined,
    dueDate: normalizeText(formData.get("dueDate")) || undefined
  });

  revalidatePath("/home");
  revalidatePath(`/rooms/${context.familyId}`);
}

export async function completeFamilyTaskAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const taskId = normalizeText(formData.get("taskId"));

  if (!taskId) {
    return;
  }

  await updateFamilyTaskStatus({ taskId, status: "done" });

  revalidatePath("/home");
  revalidatePath(`/rooms/${context.familyId}`);
}
