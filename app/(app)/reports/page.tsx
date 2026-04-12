import { ReportBoard } from "@/components/reports/report-board";
import { RealtimeRefresh } from "@/components/shared/realtime-refresh";
import { listFamilyReports } from "@/lib/repositories/family-reports";
import { getProfileBoardData } from "@/lib/repositories/profiles";

export default async function ReportsPage() {
  const [threads, profileBoard] = await Promise.all([listFamilyReports(), getProfileBoardData()]);

  return (
    <>
      <RealtimeRefresh tables={["family_reports", "family_report_actions", "profiles"]} />
      <ReportBoard threads={threads} profiles={profileBoard.profiles} />
    </>
  );
}
