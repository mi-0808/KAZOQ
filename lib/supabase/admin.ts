import { createClient } from "@supabase/supabase-js";
import { getSupabaseServerEnv } from "@/lib/server-env";

export function createAdminClient() {
  const { url, serviceRoleKey } = getSupabaseServerEnv();

  if (!url || !serviceRoleKey) {
    throw new Error("Supabase admin credentials are not configured");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
