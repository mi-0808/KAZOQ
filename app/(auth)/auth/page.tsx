import { AuthChoiceScreen } from "@/components/shared/auth-choice-screen";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { ensureAppUserFromSession } from "@/lib/repositories/app-context";
import { createClient } from "@/lib/supabase/server";

export default async function AuthPage() {
  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        const context = await ensureAppUserFromSession();
        redirect(context?.familyId ? `/rooms/${context.familyId}` : "/auth/family");
      }
    } catch {
      // Fall back to the auth landing screen when session resolution fails.
    }
  }

  return <AuthChoiceScreen />;
}
