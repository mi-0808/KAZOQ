import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { isSupabaseConfigured } from "@/lib/config";
import { ensureAppUserFromSession } from "@/lib/repositories/app-context";
import { getFamilyPreferences } from "@/lib/repositories/family-preferences";
import { getProfileBoardData } from "@/lib/repositories/profiles";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const sessionContext = await ensureAppUserFromSession();

  if (isSupabaseConfigured() && !sessionContext) {
    redirect("/auth");
  }

  const [profileBoard, preferences] = await Promise.all([
    getProfileBoardData(sessionContext?.familyId),
    getFamilyPreferences(sessionContext?.familyId)
  ]);

  return (
    <AppShell
      familyName={profileBoard.family.name}
      inviteCode={profileBoard.family.inviteCode}
      profiles={profileBoard.profiles}
      menuItemIds={preferences.menuItemIds}
    >
      {children}
    </AppShell>
  );
}
