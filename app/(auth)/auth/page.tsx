import { AuthChoiceScreen } from "@/components/shared/auth-choice-screen";
import { FamilyRoomSetupScreen } from "@/components/shared/family-room-setup-screen";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { ensureAppUserFromSession } from "@/lib/repositories/app-context";
import { createClient } from "@/lib/supabase/server";

export default async function AuthPage() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const [
        {
          data: { user }
        },
        {
          data: { session }
        }
      ] = await Promise.all([supabase.auth.getUser(), supabase.auth.getSession()]);

      const authenticatedUser = user ?? session?.user ?? null;

      if (authenticatedUser) {
        try {
          const context = await ensureAppUserFromSession();

          if (context?.familyId) {
            redirect(`/rooms/${context.familyId}`);
          }
        } catch {
          // Keep showing family setup for authenticated users even when bootstrap lags.
        }

        return <FamilyRoomSetupScreen accountLabel={authenticatedUser.email ?? undefined} />;
      }
    } catch {
      // Fall back to the auth landing screen when session resolution fails.
    }
  }

  return <AuthChoiceScreen />;
}
