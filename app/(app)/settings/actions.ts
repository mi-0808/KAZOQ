"use server";

import { revalidatePath } from "next/cache";
import { sanitizeFamilyPreferences } from "@/lib/family-preferences";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { updateFamilyPreferences } from "@/lib/repositories/family-preferences";

function normalizeMultiSelect(formData: FormData, key: string) {
  return formData.getAll(key).filter((value): value is string => typeof value === "string").map((value) => value.trim());
}

export async function updateFamilyPreferencesAction(formData: FormData) {
  const context = await getCurrentAppContext();
  const preferences = sanitizeFamilyPreferences({
    menuItemIds: normalizeMultiSelect(formData, "menuItemIds"),
    shortcutItemIds: normalizeMultiSelect(formData, "shortcutItemIds"),
    favoriteItemIds: normalizeMultiSelect(formData, "favoriteItemIds")
  });

  await updateFamilyPreferences(context.familyId, preferences);

  revalidatePath("/settings");
  revalidatePath("/home");
  revalidatePath("/", "layout");
}
