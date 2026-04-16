import { FamilyRoomSetupScreen } from "@/components/shared/family-room-setup-screen";
import { redirect } from "next/navigation";
import { isSupabaseConfigured } from "@/lib/config";
import { ensureAppUserFromSession } from "@/lib/repositories/app-context";
import { createClient } from "@/lib/supabase/server";

export default async function FamilySetupPage({
  searchParams
}: {
  searchParams?: Promise<{ error?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const errorMessage = resolvedSearchParams?.error;

  if (!isSupabaseConfigured()) {
    redirect("/auth?error=Supabase%20%E8%A8%AD%E5%AE%9A%E3%81%8C%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%82%81%E3%81%A6%E3%81%84%E3%81%AA%E3%81%84%E3%81%9F%E3%82%81%E3%80%81%E3%83%87%E3%83%A2%E8%A1%A8%E7%A4%BA%E3%82%92%E5%81%9C%E6%AD%A2%E3%81%97%E3%81%BE%E3%81%97%E3%81%9F%E3%80%82.env.local%20%E3%81%AE%E8%AA%AD%E3%81%BF%E8%BE%BC%E3%81%BF%E3%81%A8%E9%96%8B%E7%99%BA%E3%82%B5%E3%83%BC%E3%83%90%E3%83%BC%E5%86%8D%E8%B5%B7%E5%8B%95%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%97%E3%81%A6%E3%81%8F%E3%81%A0%E3%81%95%E3%81%84%E3%80%82");
  }

  try {
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth");
    }

    try {
      const context = await ensureAppUserFromSession();

      if (context?.familyId) {
        redirect(`/rooms/${context.familyId}`);
      }
    } catch {
      // Allow authenticated users to continue to the family setup screen
      // even if app-context bootstrap has not completed yet.
    }

    return <FamilyRoomSetupScreen accountLabel={user.email ?? undefined} errorMessage={errorMessage} />;
  } catch {
    redirect("/auth");
  }
}
