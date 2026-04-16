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

    try {
      const context = await ensureAppUserFromSession();

      if (context?.familyId) {
        redirect(`/rooms/${context.familyId}`);
      }
    } catch {
      // Allow authenticated users to continue to the family setup screen
      // even if app-context bootstrap has not completed yet.
    }

    return <FamilyRoomSetupScreen accountLabel={user.email ?? undefined} errorMessage={errorMessage} />;
  } catch {
    redirect("/auth");
  }
}
