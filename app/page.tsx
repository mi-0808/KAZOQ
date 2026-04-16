import { redirect } from "next/navigation";
import { TopLanding } from "@/components/top/top-landing";
import { isSupabaseConfigured } from "@/lib/config";
import { getAuthenticatedRedirectPath } from "@/lib/auth-routing";

export default async function IndexPage() {
  if (isSupabaseConfigured()) {
    try {
      const redirectPath = await getAuthenticatedRedirectPath();
      if (redirectPath) {
        redirect(redirectPath);
      }
    } catch {
      // セッション確認失敗時はランディングページを表示
    }
  }

  return <TopLanding />;
}
