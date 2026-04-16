import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { isSupabaseConfigured } from "@/lib/config";
import { defaultFamilyPreferences } from "@/lib/family-preferences";
import { ensureAppUserFromSession } from "@/lib/repositories/app-context";
import { getFamilyPreferences } from "@/lib/repositories/family-preferences";
import { getProfileBoardData } from "@/lib/repositories/profiles";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  let sessionContext = null;

  try {
    sessionContext = await ensureAppUserFromSession();
  } catch {
    redirect("/auth");
  }

  if (isSupabaseConfigured() && !sessionContext) {
    redirect("/auth");
  }

  if (isSupabaseConfigured() && sessionContext && !sessionContext.familyId) {
    redirect("/auth/family");
  }

  let shellData: {
    familyName: string;
    inviteCode: string;
    familyId: string;
    profiles: Awaited<ReturnType<typeof getProfileBoardData>>["profiles"];
    menuItemIds: string[];
  };

  try {
    const [profileBoard, preferences] = await Promise.all([
      getProfileBoardData(sessionContext?.familyId),
      getFamilyPreferences(sessionContext?.familyId)
    ]);

    shellData = {
      familyName: profileBoard.family.name,
      inviteCode: profileBoard.family.inviteCode,
      familyId: profileBoard.family.id,
      profiles: profileBoard.profiles,
      menuItemIds: preferences.menuItemIds
    };
  } catch {
    shellData = {
      familyName: sessionContext?.familyName || "家族ルーム",
      inviteCode: sessionContext?.inviteCode || "",
      familyId: sessionContext?.familyId || "",
      profiles: [],
      menuItemIds: defaultFamilyPreferences.menuItemIds
    };
  }

  return (
    <AppShell
      familyName={shellData.familyName}
      inviteCode={shellData.inviteCode}
      profiles={shellData.profiles}
      menuItemIds={shellData.menuItemIds as typeof defaultFamilyPreferences.menuItemIds}
      homeHref={`/rooms/${shellData.familyId}`}
    >
      {children}
    </AppShell>
  );
}
