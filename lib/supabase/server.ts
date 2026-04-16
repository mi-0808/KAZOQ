import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/utils/supabase/server";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(cookieStore);
}
