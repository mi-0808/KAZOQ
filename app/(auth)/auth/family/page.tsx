import { FamilyRoomSetupScreen } from "@/components/shared/family-room-setup-screen";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { ensureAppUserFromSession } from "@/lib/repositories/app-context";
import { createClient } from "@/lib/supabase/server";

export default async function FamilySetupPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const errorMessage = resolvedSearchParams?.error;

  if (!isSupabaseConfigured()) {
    return <FamilyRoomSetupScreen accountLabel="デモアカウント" errorMessage={errorMessage} />;
  }

  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth");
    }

    const context = await ensureAppUserFromSession();

    if (context?.familyId) {
      redirect(`/rooms/${context.familyId}`);
    }

    return <FamilyRoomSetupScreen accountLabel={user.email ?? undefined} errorMessage={errorMessage} />;
  } catch {
    redirect("/auth");
  }
}
