import { createClient as createBrowserClient } from "@/utils/supabase/client";

export function createClient() {
  return createBrowserClient();
}
