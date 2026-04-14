import { FavoriteFeature, FamilyPreferences, FamilyReportThread, FamilyTask, HomeShortcut, Message } from "@/types/domain";
import { buildFavoriteFeatures, buildHomeShortcuts } from "@/lib/family-preferences";
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
  latestReport: FamilyReportThread | null;
  reportPeek: FamilyReportThread[];
  latestMessage: Message | null;
  tasks: FamilyTask[];
  summary: {
    unreadMessages: number;
    pendingReports: number;
    openTasks: number;
  };
}

export async function getHomeFeed(familyId?: string): Promise<HomeFeed> {
  const context = await getCurrentAppContext();
  const resolvedFamilyId = familyId ?? context.familyId;

  if (!resolvedFamilyId) {
    throw new Error("Family room context could not be resolved.");
  }
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
    latestReport: reports[0] ?? null,
    reportPeek: reports.slice(0, 2),
    latestMessage: messageList[0] ?? null,
    tasks: tasks.slice(0, 4),
    summary: {
      unreadMessages: messageList.filter((message) => !message.readBy.includes(context.appUserId)).length,
      pendingReports: reports.filter((report) => report.status !== "完了").length,
      openTasks: tasks.filter((task) => task.status === "open").length
    }
  };
}
