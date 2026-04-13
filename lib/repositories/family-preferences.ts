import { createClient } from "@/lib/supabase/server";
import { shouldUseDemoData } from "@/lib/config";
import { defaultFamilyPreferences, sanitizeFamilyPreferences } from "@/lib/family-preferences";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { FamilyPreferences } from "@/types/domain";
import type { Database } from "@/types/supabase";

type FamilySettingsRow = Pick<
  Database["public"]["Tables"]["families"]["Row"],
  "id" | "menu_item_ids" | "shortcut_item_ids" | "favorite_item_ids"
>;

export async function getFamilyPreferences(familyId?: string): Promise<FamilyPreferences> {
  if (await shouldUseDemoData()) {
    return defaultFamilyPreferences;
  }

  const context = await getCurrentAppContext();
  const resolvedFamilyId = familyId ?? context.familyId;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("families")
    .select("id, menu_item_ids, shortcut_item_ids, favorite_item_ids")
    .eq("id", resolvedFamilyId)
    .limit(1)
    .maybeSingle<FamilySettingsRow>();

  if (error) {
    throw error;
  }

  return sanitizeFamilyPreferences({
    menuItemIds: data?.menu_item_ids ?? defaultFamilyPreferences.menuItemIds,
    shortcutItemIds: data?.shortcut_item_ids ?? defaultFamilyPreferences.shortcutItemIds,
    favoriteItemIds: data?.favorite_item_ids ?? defaultFamilyPreferences.favoriteItemIds
  });
}

export async function updateFamilyPreferences(familyId: string, preferences: FamilyPreferences) {
  if (await shouldUseDemoData()) {
    return { mode: "mock" as const };
  }

  const supabase = await createClient();
  const normalized = sanitizeFamilyPreferences(preferences);
  const { error } = await supabase
    .from("families")
    .update({
      menu_item_ids: normalized.menuItemIds,
      shortcut_item_ids: normalized.shortcutItemIds,
      favorite_item_ids: normalized.favoriteItemIds
    })
    .eq("id", familyId);

  if (error) {
    throw error;
  }

  return { mode: "supabase" as const, id: familyId };
}
