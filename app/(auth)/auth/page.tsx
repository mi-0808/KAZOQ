import { redirect } from "next/navigation";
import { AuthChoiceScreen } from "@/components/shared/auth-choice-screen";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUserFromSession } from "@/lib/repositories/app-context";
import { isSupabaseConfigured } from "@/lib/config";

export default async function AuthPage() {
  if (!isSupabaseConfigured()) {
    return <AuthChoiceScreen />;
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <AuthChoiceScreen />;
  }

  const context = await ensureAppUserFromSession();

  if (!context) {
    return <AuthChoiceScreen />;
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
