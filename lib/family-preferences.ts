import { FavoriteFeature, FavoriteFeatureId, FamilyMenuItemId, FamilyPreferences, FamilyShortcutId, HomeShortcut } from "@/types/domain";

export const defaultFamilyPreferences: FamilyPreferences = {
  menuItemIds: ["reports", "messages", "calendar", "locations", "profile"],
  shortcutItemIds: ["reports", "calendar", "messages", "locations"],
  favoriteItemIds: ["meal", "report", "schedule", "location"],
  notificationLevel: "important",
  diaryVisibility: "family",
  locationSharingMode: "manual",
  tasksEnabled: true
};

export const menuItemOptions: { id: FamilyMenuItemId; label: string; description: string }[] = [
  { id: "reports", label: "報連相", description: "届出や確認ごとを家族ツリーで共有" },
  { id: "messages", label: "メッセージ", description: "ご飯や買い物をテンプレ付きで連絡" },
  { id: "calendar", label: "予定", description: "学校や通院などの予定を一覧で確認" },
  { id: "locations", label: "場所", description: "家族の位置や登録地点をまとめて見る" },
  { id: "profile", label: "プロフィール", description: "役割やひとこと、所属先を整理" }
];

const shortcutCatalog: Record<FamilyShortcutId, HomeShortcut> = {
  reports: { id: "reports", label: "報連相を出す", description: "欠食届や外泊届をツリーで共有", href: "/reports" },
  calendar: { id: "calendar", label: "予定を追加", description: "学校や通院予定を記録", href: "/calendar" },
  messages: { id: "messages", label: "ご飯を投稿", description: "今日のご飯をテンプレで共有", href: "/messages" },
  locations: { id: "locations", label: "場所を確認", description: "家族の位置と登録地点を見る", href: "/locations" }
};

export const shortcutOptions: (HomeShortcut & { id: FamilyShortcutId })[] = Object.values(shortcutCatalog) as (HomeShortcut & {
  id: FamilyShortcutId;
})[];

const favoriteFeatureCatalog: Record<FavoriteFeatureId, FavoriteFeature> = {
  meal: { id: "meal", label: "ご飯連絡", description: "今日のメニューや食べ始めをすぐ共有", href: "/messages" },
  report: { id: "report", label: "届出・報連相", description: "欠食届や外泊届を迷わず出せる", href: "/reports" },
  schedule: { id: "schedule", label: "予定確認", description: "学校や通院予定を家族で見逃しにくい", href: "/calendar" },
  location: { id: "location", label: "見守り場所", description: "今いる場所と登録地点をひと目で確認", href: "/locations" },
  diary: { id: "diary", label: "日記", description: "その日の気分や出来事をやさしく残せる", href: "/diary" }
};

export const favoriteFeatureOptions: FavoriteFeature[] = Object.values(favoriteFeatureCatalog);

function normalizeSelection<T extends string>(values: string[], allowed: readonly T[], fallback: readonly T[]) {
  const allowedSet = new Set(allowed);
  const normalized = values.filter((value): value is T => allowedSet.has(value as T));

  return normalized.length > 0 ? normalized : [...fallback];
}

export function sanitizeFamilyPreferences(input?: {
  menuItemIds?: string[];
  shortcutItemIds?: string[];
  favoriteItemIds?: string[];
  notificationLevel?: string;
  diaryVisibility?: string;
  locationSharingMode?: string;
  tasksEnabled?: boolean | null;
} | null): FamilyPreferences {
  const notificationLevel = input?.notificationLevel === "off" || input?.notificationLevel === "all" ? input.notificationLevel : defaultFamilyPreferences.notificationLevel;
  const diaryVisibility =
    input?.diaryVisibility === "guardians" || input?.diaryVisibility === "private" ? input.diaryVisibility : defaultFamilyPreferences.diaryVisibility;
  const locationSharingMode = input?.locationSharingMode === "auto" ? "auto" : defaultFamilyPreferences.locationSharingMode;

  return {
    menuItemIds: normalizeSelection(input?.menuItemIds ?? [], menuItemOptions.map((item) => item.id), defaultFamilyPreferences.menuItemIds),
    shortcutItemIds: normalizeSelection(
      input?.shortcutItemIds ?? [],
      shortcutOptions.map((item) => item.id as FamilyShortcutId),
      defaultFamilyPreferences.shortcutItemIds
    ),
    favoriteItemIds: normalizeSelection(
      input?.favoriteItemIds ?? [],
      favoriteFeatureOptions.map((item) => item.id),
      defaultFamilyPreferences.favoriteItemIds
    ),
    notificationLevel,
    diaryVisibility,
    locationSharingMode,
    tasksEnabled: input?.tasksEnabled ?? defaultFamilyPreferences.tasksEnabled
  };
}

export function buildHomeShortcuts(shortcutItemIds: FamilyShortcutId[]) {
  return shortcutItemIds.map((id) => shortcutCatalog[id]).filter(Boolean);
}

export function buildFavoriteFeatures(favoriteItemIds: FavoriteFeatureId[]) {
  return favoriteItemIds.map((id) => favoriteFeatureCatalog[id]).filter(Boolean);
}
