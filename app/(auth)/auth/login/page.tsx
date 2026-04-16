import { AuthCredentialScreen } from "@/components/shared/auth-credential-screen";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { getAuthenticatedRedirectPath } from "@/lib/auth-routing";

export default async function LoginPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string; message?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const errorMessage = resolvedSearchParams?.error;
  const message = resolvedSearchParams?.message;

  if (isSupabaseConfigured()) {
    try {
      const redirectPath = await getAuthenticatedRedirectPath();
      if (redirectPath) {
        redirect(redirectPath);
      }
    } catch {
      // Keep rendering the login form when the session cannot be resolved.
    }
  }

  return <AuthCredentialScreen mode="login" errorMessage={errorMessage} message={message} />;
}
