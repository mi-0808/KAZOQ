import { AuthCredentialScreen } from "@/components/shared/auth-credential-screen";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { ensureAppUserFromSession } from "@/lib/repositories/app-context";
import { createClient } from "@/lib/supabase/server";

export default async function SignupPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; message?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const errorMessage = resolvedSearchParams?.error;
  const message = resolvedSearchParams?.message;

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
      // Keep rendering the signup form when the session cannot be resolved.
    }
  }

  return <AuthCredentialScreen mode="signup" errorMessage={errorMessage} message={message} />;
}
