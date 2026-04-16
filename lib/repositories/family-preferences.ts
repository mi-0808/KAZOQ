import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import { defaultFamilyPreferences, sanitizeFamilyPreferences } from "@/lib/family-preferences";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { FamilyPreferences } from "@/types/domain";
import type { Database } from "@/types/supabase";

type FamilySettingsRow = Pick<
  Database["public"]["Tables"]["families"]["Row"],
  | "id"
  | "menu_item_ids"
  | "shortcut_item_ids"
  | "favorite_item_ids"
  | "notification_level"
  | "diary_visibility"
  | "location_sharing_mode"
  | "tasks_enabled"
>;

function isMissingColumnError(error: { code?: string | null } | null) {
  return error?.code === "42703";
}

export async function getFamilyPreferences(familyId?: string): Promise<FamilyPreferences> {
  if (!isSupabaseConfigured()) {
    return sanitizeFamilyPreferences(defaultFamilyPreferences);
  }

  const context = await getCurrentAppContext();
  const resolvedFamilyId = familyId ?? context.familyId;

  if (!resolvedFamilyId) {
    return sanitizeFamilyPreferences(defaultFamilyPreferences);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("families")
    .select("id, menu_item_ids, shortcut_item_ids, favorite_item_ids, notification_level, diary_visibility, location_sharing_mode, tasks_enabled")
    .eq("id", resolvedFamilyId)
    .limit(1)
    .maybeSingle<FamilySettingsRow>();

  if (error && !isMissingColumnError(error)) {
    throw error;
  }

  if (isMissingColumnError(error)) {
    const { data: legacyData, error: legacyError } = await supabase
      .from("families")
      .select("id, menu_item_ids, shortcut_item_ids, favorite_item_ids")
      .eq("id", resolvedFamilyId)
      .limit(1)
      .maybeSingle<Pick<FamilySettingsRow, "id" | "menu_item_ids" | "shortcut_item_ids" | "favorite_item_ids">>();

    if (legacyError) {
      throw legacyError;
    }

    return sanitizeFamilyPreferences({
      menuItemIds: legacyData?.menu_item_ids ?? defaultFamilyPreferences.menuItemIds,
      shortcutItemIds: legacyData?.shortcut_item_ids ?? defaultFamilyPreferences.shortcutItemIds,
      favoriteItemIds: legacyData?.favorite_item_ids ?? defaultFamilyPreferences.favoriteItemIds
    });
  }

  return sanitizeFamilyPreferences({
    menuItemIds: data?.menu_item_ids ?? defaultFamilyPreferences.menuItemIds,
    shortcutItemIds: data?.shortcut_item_ids ?? defaultFamilyPreferences.shortcutItemIds,
    favoriteItemIds: data?.favorite_item_ids ?? defaultFamilyPreferences.favoriteItemIds,
    notificationLevel: data?.notification_level ?? defaultFamilyPreferences.notificationLevel,
    diaryVisibility: data?.diary_visibility ?? defaultFamilyPreferences.diaryVisibility,
    locationSharingMode: data?.location_sharing_mode ?? defaultFamilyPreferences.locationSharingMode,
    tasksEnabled: data?.tasks_enabled ?? defaultFamilyPreferences.tasksEnabled
  });
}

export async function updateFamilyPreferences(familyId: string, preferences: FamilyPreferences) {
  const normalized = sanitizeFamilyPreferences(preferences);

  if (!isSupabaseConfigured()) {
    return { mode: "demo" as const, id: familyId, preferences: normalized };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("families")
    .update({
      menu_item_ids: normalized.menuItemIds,
      shortcut_item_ids: normalized.shortcutItemIds,
      favorite_item_ids: normalized.favoriteItemIds,
      notification_level: normalized.notificationLevel,
      diary_visibility: normalized.diaryVisibility,
      location_sharing_mode: normalized.locationSharingMode,
      tasks_enabled: normalized.tasksEnabled
    })
    .eq("id", familyId);

  if (error && !isMissingColumnError(error)) {
    throw error;
  }

  if (isMissingColumnError(error)) {
    const { error: legacyError } = await supabase
      .from("families")
      .update({
        menu_item_ids: normalized.menuItemIds,
        shortcut_item_ids: normalized.shortcutItemIds,
        favorite_item_ids: normalized.favoriteItemIds
      })
      .eq("id", familyId);

    if (legacyError) {
      throw legacyError;
    }
  }

  return { mode: "supabase" as const, id: familyId };
}
