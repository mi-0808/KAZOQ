import { family, familyReports, messages, shortcuts } from "@/data/mock-data";
import { HomeShortcut, FamilyReportThread, Message } from "@/types/domain";
import { shouldUseDemoData } from "@/lib/config";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { listFamilyReports } from "@/lib/repositories/family-reports";
import { listMessages } from "@/lib/repositories/messages";

export interface HomeFeed {
  familyName: string;
  shortcuts: HomeShortcut[];
  latestReport: FamilyReportThread;
  reportPeek: FamilyReportThread[];
  latestMessage: Message;
}

export async function getHomeFeed(familyId = family.id): Promise<HomeFeed> {
  if (await shouldUseDemoData()) {
    return {
      familyName: family.name,
      shortcuts,
      latestReport: familyReports[0],
      reportPeek: familyReports.slice(0, 2),
      latestMessage: messages[0]
    };
  }

  const context = await getCurrentAppContext();
  const resolvedFamilyId = familyId ?? context.familyId;
  const [reports, messageList] = await Promise.all([listFamilyReports(resolvedFamilyId), listMessages(resolvedFamilyId)]);

  return {
    familyName: context.familyName,
    shortcuts,
    latestReport: reports[0] ?? familyReports[0],
    reportPeek: reports.slice(0, 2),
    latestMessage: messageList[0] ?? messages[0]
  };
}
