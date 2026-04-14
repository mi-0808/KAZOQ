import { notFound, redirect } from "next/navigation";
import { HomeDashboard } from "@/components/home/home-dashboard";
import { RealtimeRefresh } from "@/components/shared/realtime-refresh";
import { getCurrentAppContext } from "@/lib/repositories/app-context";
import { getHomeFeed } from "@/lib/repositories/home";

export default async function RoomPage({ params }: { params: Promise<{ familyId: string }> }) {
  const { familyId } = await params;

  if (!familyId) {
    notFound();
  }

  const context = await getCurrentAppContext();

  if (!context.familyId) {
    redirect("/auth");
  }

  if (context.familyId !== familyId) {
    redirect(`/rooms/${context.familyId}`);
  }

  const feed = await getHomeFeed(familyId);

  return (
    <>
      <RealtimeRefresh tables={["messages", "message_reads", "family_reports", "family_report_actions", "profiles", "family_tasks"]} />
      <HomeDashboard feed={feed} />
    </>
  );
}
