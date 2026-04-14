import { redirect } from "next/navigation";
import { AuthScreen } from "@/components/shared/auth-screen";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUserFromSession } from "@/lib/repositories/app-context";
import { isSupabaseConfigured } from "@/lib/config";

export default async function AuthPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const errorMessage = resolvedSearchParams?.error;

  if (!isSupabaseConfigured()) {
    return <AuthScreen errorMessage={errorMessage} />;
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <AuthScreen errorMessage={errorMessage} />;
  }

  const context = await ensureAppUserFromSession();

  if (!context) {
    return <AuthScreen errorMessage={errorMessage} />;
  }

  const { data: membership, error } = await supabase
    .from("family_members")
    .select("family_id")
    .eq("user_id", context.appUserId)
    .limit(1)
    .maybeSingle<{ family_id: string }>();

  if (error) {
    throw error;
  }

  if (membership) {
    redirect(`/rooms/${membership.family_id}`);
  }

  redirect("/auth/family");
}
