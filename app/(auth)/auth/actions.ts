"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { revalidatePath } from "next/cache";
import { family } from "@/data/mock-data";
import { isSupabaseConfigured } from "@/lib/config";
import { sanitizeFamilyPreferences } from "@/lib/family-preferences";
import { ensureAppUserFromSession } from "@/lib/repositories/app-context";
import { getSiteUrl } from "@/lib/site-url";
import { createClient } from "@/lib/supabase/server";

function redirectWithError(message: string, path = "/auth") {
  redirect(`${path}?error=${encodeURIComponent(message)}`);
}

function rethrowIfRedirect(error: unknown) {
  if (isRedirectError(error)) {
    throw error;
  }
}

function normalizeEmail(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeErrorPath(formData: FormData, fallbackPath: string) {
  const path = normalizeText(formData.get("errorPath"));
  return path || fallbackPath;
}

function createInviteCode(name: string) {
  const prefix = name.replace(/\s+/g, "").slice(0, 4).toUpperCase() || "KAZO";
  return `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
}

function normalizeMultiSelect(formData: FormData, key: string) {
  return formData.getAll(key).filter((value): value is string => typeof value === "string").map((value) => value.trim());
}

function redirectToDemoRoom() {
  revalidatePath("/", "layout");
  redirect(`/rooms/${family.id}`);
}

export async function signInAction(formData: FormData) {
  const errorPath = normalizeErrorPath(formData, "/auth/login");

  try {
    if (!isSupabaseConfigured()) {
      redirectToDemoRoom();
    }

    const email = normalizeEmail(formData.get("email"));
    const password = normalizeText(formData.get("password"));

    if (!email || !password) {
      redirectWithError("メールアドレスとパスワードを入力してください。", errorPath);
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      redirectWithError(error.message, errorPath);
    }

    revalidatePath("/", "layout");
    redirect("/auth/family");
  } catch (error) {
    rethrowIfRedirect(error);
    redirectWithError(error instanceof Error ? error.message : "ログインに失敗しました。", errorPath);
  }
}

export async function signUpAction(formData: FormData) {
  const errorPath = normalizeErrorPath(formData, "/auth/signup");

  try {
    if (!isSupabaseConfigured()) {
      redirect("/auth/family");
    }

    const email = normalizeEmail(formData.get("email"));
    const password = normalizeText(formData.get("password"));
    const name = normalizeText(formData.get("name"));

    if (!email || !password) {
      redirectWithError("メールアドレスとパスワードを入力してください。", errorPath);
    }

    const supabase = await createClient();
    const {
      data: { session },
      error
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getSiteUrl(),
        data: {
          name: name || email.split("@")[0]
        }
      }
    });

    if (error) {
      redirectWithError(error.message, errorPath);
    }

    if (!session) {
      redirect("/auth/login?message=" + encodeURIComponent("確認メールを開いたあと、ログインして続けてください。"));
    }

    revalidatePath("/", "layout");
    redirect("/auth/family");
  } catch (error) {
    rethrowIfRedirect(error);
    redirectWithError(error instanceof Error ? error.message : "新規登録に失敗しました。", errorPath);
  }
}

export async function joinFamilyAction(formData: FormData) {
  try {
    if (!isSupabaseConfigured()) {
      redirectToDemoRoom();
    }

    const inviteCode = normalizeText(formData.get("inviteCode"));

    if (!inviteCode) {
      redirectWithError("招待コードを入力してください。", "/auth/family");
    }

    const supabase = await createClient();
    const context = await ensureAppUserFromSession();

    if (!context) {
      redirectWithError("先にアカウントへログインしてください。", "/auth");
    }

    const resolvedContext = context!;

    const relationLabel = normalizeText(formData.get("relationLabel")) || "家族";
    const roleLabel = normalizeText(formData.get("roleLabel")) || "その他";

    const { data: targetFamily, error: familyError } = await supabase
      .from("families")
      .select("id")
      .eq("invite_code", inviteCode)
      .limit(1)
      .maybeSingle<{ id: string }>();

    if (familyError || !targetFamily) {
      redirectWithError("招待コードに一致する家族ルームが見つかりませんでした。", "/auth/family");
    }

    const resolvedFamily = targetFamily!;

    const { error: memberError } = await supabase.from("family_members").upsert(
      {
        family_id: resolvedFamily.id,
        user_id: resolvedContext.appUserId,
        role_label: roleLabel,
        relation_label: relationLabel
      },
      {
        onConflict: "family_id,user_id"
      }
    );

    if (memberError) {
      throw memberError;
    }

    revalidatePath("/", "layout");
    redirect(`/rooms/${resolvedFamily.id}`);
  } catch (error) {
    rethrowIfRedirect(error);
    redirectWithError(error instanceof Error ? error.message : "家族グループへの参加に失敗しました。", "/auth/family");
  }
}

export async function createFamilyRoomAction(formData: FormData) {
  try {
    if (!isSupabaseConfigured()) {
      redirectToDemoRoom();
    }

    const familyName = normalizeText(formData.get("familyName"));
    const relationLabel = normalizeText(formData.get("relationLabel")) || "家族";
    const roleLabel = normalizeText(formData.get("roleLabel")) || "親";
    const organization = normalizeText(formData.get("organization"));
    const status = normalizeText(formData.get("status")) || "KAZOQをはじめました";
    const preferences = sanitizeFamilyPreferences({
      menuItemIds: normalizeMultiSelect(formData, "menuItemIds"),
      shortcutItemIds: normalizeMultiSelect(formData, "shortcutItemIds"),
      favoriteItemIds: normalizeMultiSelect(formData, "favoriteItemIds")
    });

    if (!familyName) {
      redirectWithError("家族ルーム名を入力してください。", "/auth/family");
    }

    const supabase = await createClient();
    const context = await ensureAppUserFromSession();

    if (!context) {
      redirectWithError("先にアカウント作成を完了してください。", "/auth");
    }

    const resolvedContext = context!;

    const inviteCode = createInviteCode(familyName);

    const { data: createdFamily, error: familyError } = await supabase
      .from("families")
      .insert({
        name: familyName,
        invite_code: inviteCode,
        created_by: resolvedContext.appUserId,
        menu_item_ids: preferences.menuItemIds,
        shortcut_item_ids: preferences.shortcutItemIds,
        favorite_item_ids: preferences.favoriteItemIds
      })
      .select("id")
      .single<{ id: string }>();

    if (familyError || !createdFamily) {
      throw familyError ?? new Error("Failed to create family room");
    }

    const { error: memberError } = await supabase.from("family_members").insert({
      family_id: createdFamily.id,
      user_id: resolvedContext.appUserId,
      role_label: roleLabel,
      relation_label: relationLabel
    });

    if (memberError) {
      throw memberError;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        family_role: roleLabel,
        organization: organization || null,
        status
      })
      .eq("user_id", resolvedContext.appUserId);

    if (profileError) {
      throw profileError;
    }

    revalidatePath("/", "layout");
    redirect(`/rooms/${createdFamily.id}`);
  } catch (error) {
    rethrowIfRedirect(error);
    redirectWithError(error instanceof Error ? error.message : "家族ルーム作成に失敗しました。", "/auth/family");
  }
}
