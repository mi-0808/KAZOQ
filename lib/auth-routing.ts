import { ensureAppUserFromSession } from "@/lib/repositories/app-context";
import { createClient } from "@/lib/supabase/server";

export async function getAuthenticatedRedirectPath() {
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

  if (!authenticatedUser) {
    return null;
  }

  try {
    const context = await ensureAppUserFromSession();
    if (context?.familyId) {
      return `/rooms/${context.familyId}`;
    }
  } catch {
    // Auth is still valid even when app-context bootstrap lags behind.
  }

  return "/auth/family";
}
