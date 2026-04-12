import { HomeDashboard } from "@/components/home/home-dashboard";
import { RealtimeRefresh } from "@/components/shared/realtime-refresh";
import { getHomeFeed } from "@/lib/repositories/home";

export default async function HomePage() {
  const feed = await getHomeFeed();

  return (
    <>
      <RealtimeRefresh tables={["messages", "family_reports", "family_report_actions", "profiles"]} />
      <HomeDashboard feed={feed} />
    </>
  );
}
