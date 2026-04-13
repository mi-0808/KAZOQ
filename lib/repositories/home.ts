import { family, familyReports, messages } from "@/data/mock-data";
import { FavoriteFeature, FamilyPreferences, FamilyReportThread, FamilyTask, HomeShortcut, Message } from "@/types/domain";
import { shouldUseDemoData } from "@/lib/config";
import { buildFavoriteFeatures, buildHomeShortcuts, defaultFamilyPreferences } from "@/lib/family-preferences";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { getFamilyPreferences } from "@/lib/repositories/family-preferences";
import { listFamilyReports } from "@/lib/repositories/family-reports";
import { listMessages } from "@/lib/repositories/messages";
import { listFamilyTasks } from "@/lib/repositories/tasks";

export interface HomeFeed {
  familyName: string;
  shortcuts: HomeShortcut[];
  favoriteFeatures: FavoriteFeature[];
  preferences: FamilyPreferences;
  latestReport: FamilyReportThread;
  reportPeek: FamilyReportThread[];
  latestMessage: Message;
  tasks: FamilyTask[];
  summary: {
    unreadMessages: number;
    pendingReports: number;
    openTasks: number;
  };
}

export async function getHomeFeed(familyId = family.id): Promise<HomeFeed> {
  if (await shouldUseDemoData()) {
    return {
      familyName: family.name,
      shortcuts: buildHomeShortcuts(defaultFamilyPreferences.shortcutItemIds),
      favoriteFeatures: buildFavoriteFeatures(defaultFamilyPreferences.favoriteItemIds),
      preferences: defaultFamilyPreferences,
      latestReport: familyReports[0],
      reportPeek: familyReports.slice(0, 2),
      latestMessage: messages[0],
      tasks: [],
      summary: {
        unreadMessages: 2,
        pendingReports: 1,
        openTasks: 2
      }
    };
  }

  const context = await getCurrentAppContext();
  const resolvedFamilyId = familyId ?? context.familyId;
  const [reports, messageList, preferences, tasks] = await Promise.all([
    listFamilyReports(resolvedFamilyId),
    listMessages(resolvedFamilyId),
    getFamilyPreferences(resolvedFamilyId),
    listFamilyTasks(resolvedFamilyId)
  ]);

  return {
    familyName: context.familyName,
    shortcuts: buildHomeShortcuts(preferences.shortcutItemIds),
    favoriteFeatures: buildFavoriteFeatures(preferences.favoriteItemIds),
    preferences,
    latestReport: reports[0] ?? familyReports[0],
    reportPeek: reports.slice(0, 2),
    latestMessage: messageList[0] ?? messages[0],
    tasks: tasks.slice(0, 4),
    summary: {
      unreadMessages: messageList.filter((message) => !message.readBy.includes(context.appUserId)).length,
      pendingReports: reports.filter((report) => report.status !== "完了").length,
      openTasks: tasks.filter((task) => task.status === "open").length
    }
  };
}
