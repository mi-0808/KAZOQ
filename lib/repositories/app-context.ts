import { family, users } from "@/data/mock-data";
import { isSupabaseConfigured } from "@/lib/config";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

export interface AppContext {
  appUserId: string;
  familyId: string;
  familyName: string;
  inviteCode: string;
}

function normalizeName(authUser: { email?: string | null; user_metadata?: Record<string, unknown> | null }) {
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
  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    const {
      data: { user: authUser }
    } = await supabase.auth.getUser();

    if (authUser?.email) {
      const name = normalizeName(authUser);

      let { data: appUser, error: userError } = await supabase
        .from("users")
        .select("id, email, name")
        .eq("auth_user_id", authUser.id)
        .limit(1)
        .maybeSingle<Pick<Database["public"]["Tables"]["users"]["Row"], "id" | "email" | "name">>();

      if (userError) {
        throw userError;
      }

      if (!appUser) {
        const { data: createdUser, error: createUserError } = await supabase
          .from("users")
          .insert({
            auth_user_id: authUser.id,
            email: authUser.email,
            name
          })
          .select("id, email, name")
          .single<Pick<Database["public"]["Tables"]["users"]["Row"], "id" | "email" | "name">>();

        if (createUserError || !createdUser) {
          throw createUserError ?? new Error("Failed to create app user");
        }

        appUser = createdUser;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", appUser.id)
        .limit(1)
        .maybeSingle<Pick<Database["public"]["Tables"]["profiles"]["Row"], "user_id">>();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        const { error: createProfileError } = await supabase.from("profiles").insert({
          user_id: appUser.id,
          display_name: name,
          family_role: "その他",
          activities: [],
          bio: "",
          status: "はじめまして",
          accent_color: "bg-blush"
        });

        if (createProfileError) {
          throw createProfileError;
        }
      }

      const { data: membership, error: membershipError } = await supabase
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

    return null;
  }

  const currentUser = users[0];

  return {
    appUserId: currentUser?.id ?? "u1",
    familyId: family.id,
    familyName: family.name,
    inviteCode: family.inviteCode
  };
}

export async function getCurrentAppContext() {
  const context = await ensureAppUserFromSession();

  if (!context) {
    throw new Error("Demo app context could not be resolved.");
  }

  return context;
}
