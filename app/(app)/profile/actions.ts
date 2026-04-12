"use server";

import { revalidatePath } from "next/cache";
import { updateProfile } from "@/lib/repositories/profiles";
import { getCurrentAppContext } from "@/lib/repositories/app-context";

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function updateProfileAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const activities = normalizeText(formData.get("activities"))
    .split("、")
    .map((item) => item.trim())
    .filter(Boolean);

  await updateProfile({
    userId: context.appUserId,
    name: normalizeText(formData.get("name")),
    familyRole: normalizeText(formData.get("familyRole")),
    organization: normalizeText(formData.get("organization")),
    bio: normalizeText(formData.get("bio")),
    status: normalizeText(formData.get("status")),
    activities
  });

  revalidatePath("/profile");
  revalidatePath("/home");
}
