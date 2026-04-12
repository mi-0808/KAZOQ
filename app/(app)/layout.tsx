import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { isSupabaseConfigured } from "@/lib/config";
import { ensureAppUserFromSession } from "@/lib/repositories/app-context";
import { getProfileBoardData } from "@/lib/repositories/profiles";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sessionContext = await ensureAppUserFromSession();

  if (isSupabaseConfigured() && !sessionContext) {
    redirect("/auth");
  }

  const profileBoard = await getProfileBoardData(sessionContext?.familyId);

  return (
    <AppShell familyName={profileBoard.family.name} inviteCode={profileBoard.family.inviteCode} profiles={profileBoard.profiles}>
      {children}
    </AppShell>
  );
}
