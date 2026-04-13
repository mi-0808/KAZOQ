import { family, familyReports, messages } from "@/data/mock-data";
import { FavoriteFeature, HomeShortcut, FamilyReportThread, Message } from "@/types/domain";
import { shouldUseDemoData } from "@/lib/config";
import { buildFavoriteFeatures, buildHomeShortcuts, defaultFamilyPreferences } from "@/lib/family-preferences";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { getFamilyPreferences } from "@/lib/repositories/family-preferences";
import { listFamilyReports } from "@/lib/repositories/family-reports";
import { listMessages } from "@/lib/repositories/messages";

export interface HomeFeed {
  familyName: string;
  shortcuts: HomeShortcut[];
  favoriteFeatures: FavoriteFeature[];
  latestReport: FamilyReportThread;
  reportPeek: FamilyReportThread[];
  latestMessage: Message;
}

export async function getHomeFeed(familyId = family.id): Promise<HomeFeed> {
  if (await shouldUseDemoData()) {
    return {
      familyName: family.name,
      shortcuts: buildHomeShortcuts(defaultFamilyPreferences.shortcutItemIds),
      favoriteFeatures: buildFavoriteFeatures(defaultFamilyPreferences.favoriteItemIds),
      latestReport: familyReports[0],
      reportPeek: familyReports.slice(0, 2),
      latestMessage: messages[0]
    };
  }

  const context = await getCurrentAppContext();
  const resolvedFamilyId = familyId ?? context.familyId;
  const [reports, messageList, preferences] = await Promise.all([
    listFamilyReports(resolvedFamilyId),
    listMessages(resolvedFamilyId),
    getFamilyPreferences(resolvedFamilyId)
  ]);

  return {
    familyName: context.familyName,
    shortcuts: buildHomeShortcuts(preferences.shortcutItemIds),
    favoriteFeatures: buildFavoriteFeatures(preferences.favoriteItemIds),
    latestReport: reports[0] ?? familyReports[0],
    reportPeek: reports.slice(0, 2),
    latestMessage: messageList[0] ?? messages[0]
  };
}
