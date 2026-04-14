import type { User as AuthUser } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/supabase";

export interface AppContext {
  appUserId: string;
  familyId: string;
  familyName: string;
  inviteCode: string;
}

function createProfileSeed(name: string) {
  return {
    display_name: name,
    family_role: "その他",
    activities: [],
    bio: "",
    status: "はじめまして",
    accent_color: "bg-blush"
  };
}

function normalizeName(authUser: AuthUser) {
  const metadataName = authUser.user_metadata?.name;

  if (typeof metadataName === "string" && metadataName.trim().length > 0) {
    return metadataName.trim();
  }

  if (authUser.email) {
    return authUser.email.split("@")[0];
  }

  return "KAZOQユーザー";
}

export async function ensureAppUserFromSession() {
  const supabase = await createClient();
  const admin = createAdminClient();
  const {
    data: { user: authUser }
  } = await supabase.auth.getUser();

  if (!authUser || !authUser.email) {
    return null;
  }

  const name = normalizeName(authUser);
  const { data: existingUser, error: existingUserError } = await admin
    .from("users")
    .select("id")
    .or(`auth_user_id.eq.${authUser.id},email.eq.${authUser.email}`)
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (existingUserError) {
    throw existingUserError;
  }

  const { data: appUser, error: userError } = await admin
    .from("users")
    .upsert(
      {
        id: existingUser?.id,
        auth_user_id: authUser.id,
        email: authUser.email,
        name
      },
      {
        onConflict: "auth_user_id"
      }
    )
    .select("id, email, name")
    .single<Pick<Database["public"]["Tables"]["users"]["Row"], "id" | "email" | "name">>();

  if (userError || !appUser) {
    throw userError ?? new Error("Failed to sync signed-in user");
  }

  const { error: profileError } = await admin.from("profiles").upsert(
    {
      user_id: appUser.id,
      ...createProfileSeed(name)
    },
    {
      onConflict: "user_id"
    }
  );

  if (profileError) {
    throw profileError;
  }

  const { data: membership, error: membershipError } = await admin
    .from("family_members")
    .select(
      `
        family_id,
        families (
          name,
          invite_code
        )
      `
    )
    .eq("user_id", appUser.id)
    .limit(1)
    .maybeSingle<{
      family_id: string;
      families: Pick<Database["public"]["Tables"]["families"]["Row"], "name" | "invite_code"> | null;
    }>();

  if (membershipError) {
    throw membershipError;
  }

  return {
    appUserId: appUser.id,
    familyId: membership?.family_id ?? "",
    familyName: membership?.families?.name ?? "",
    inviteCode: membership?.families?.invite_code ?? ""
  };
}

export async function getCurrentAppContext() {
  const context = await ensureAppUserFromSession();

  if (!context) {
    throw new Error("Live app context could not be resolved.");
  }

  return context;
}
