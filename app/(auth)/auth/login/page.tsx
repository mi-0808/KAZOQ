import { redirect } from "next/navigation";
import { AuthCredentialScreen } from "@/components/shared/auth-credential-screen";
import { createClient } from "@/lib/supabase/server";
import { ensureAppUserFromSession } from "@/lib/repositories/app-context";
import { isSupabaseConfigured } from "@/lib/config";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const errorMessage = resolvedSearchParams?.error;

  if (!isSupabaseConfigured()) {
    return <AuthCredentialScreen mode="login" errorMessage={errorMessage} />;
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return <AuthCredentialScreen mode="login" errorMessage={errorMessage} />;
  }

  const context = await ensureAppUserFromSession();

  if (!context) {
    return <AuthCredentialScreen mode="login" errorMessage={errorMessage} />;
  }

  if (context.familyId) {
    redirect(`/rooms/${context.familyId}`);
  }

  redirect("/auth/family");
}
