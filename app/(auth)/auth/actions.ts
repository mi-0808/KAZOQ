"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { family } from "@/data/mock-data";
import { isSupabaseConfigured } from "@/lib/config";
import { ensureAppUserFromSession, getCurrentAppContext } from "@/lib/repositories/app-context";
import { createClient } from "@/lib/supabase/server";

function normalizeEmail(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function normalizeText(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function createInviteCode(name: string) {
  const prefix = name.replace(/\s+/g, "").slice(0, 4).toUpperCase() || "KAZO";
  return `${prefix}${Math.floor(1000 + Math.random() * 9000)}`;
}

export async function signInAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/home");
  }

  const email = normalizeEmail(formData.get("email"));
  const password = normalizeText(formData.get("password"));

  if (!email || !password) {
    redirect("/auth");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect("/auth");
  }

  await getCurrentAppContext();
  revalidatePath("/", "layout");
  redirect("/home");
}

export async function signUpAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/home");
  }

  const email = normalizeEmail(formData.get("email"));
  const password = normalizeText(formData.get("password"));
  const name = normalizeText(formData.get("name"));

  if (!email || !password) {
    redirect("/auth");
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name || email.split("@")[0]
      }
    }
  });

  if (error) {
    redirect("/auth");
  }

  await getCurrentAppContext();
  revalidatePath("/", "layout");
  redirect("/home");
}

export async function joinFamilyAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/home");
  }

  const inviteCode = normalizeText(formData.get("inviteCode"));

  if (!inviteCode) {
    redirect("/auth");
  }

  const supabase = await createClient();
  const context = await ensureAppUserFromSession();
  if (!context) {
    redirect("/auth");
  }
  const relationLabel = normalizeText(formData.get("relationLabel")) || "家族";
  const roleLabel = normalizeText(formData.get("roleLabel")) || "その他";

  const { data: targetFamily, error: familyError } = await supabase
    .from("families")
    .select("id")
    .eq("invite_code", inviteCode)
    .limit(1)
    .maybeSingle<{ id: string }>();

  if (familyError || !targetFamily) {
    redirect("/auth");
  }

  const { error: memberError } = await supabase.from("family_members").upsert(
    {
      family_id: targetFamily.id,
      user_id: context.appUserId,
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
  redirect("/home");
}

export async function createFamilyRoomAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    redirect("/home");
  }

  const familyName = normalizeText(formData.get("familyName"));
  const relationLabel = normalizeText(formData.get("relationLabel")) || "家族";
  const roleLabel = normalizeText(formData.get("roleLabel")) || "親";
  const organization = normalizeText(formData.get("organization"));
  const status = normalizeText(formData.get("status")) || "KAZOQをはじめました";

  if (!familyName) {
    redirect("/auth");
  }

  const supabase = await createClient();
  const context = await ensureAppUserFromSession();
  if (!context) {
    redirect("/auth");
  }
  const inviteCode = createInviteCode(familyName);

  const { data: createdFamily, error: familyError } = await supabase
    .from("families")
    .insert({
      name: familyName,
      invite_code: inviteCode,
      created_by: context.appUserId
    })
    .select("id")
    .single<{ id: string }>();

  if (familyError || !createdFamily) {
    throw familyError ?? new Error("Failed to create family room");
  }

  const { error: memberError } = await supabase.from("family_members").insert({
    family_id: createdFamily.id,
    user_id: context.appUserId,
    role_label: roleLabel,
    relation_label: relationLabel
  });

  if (memberError) {
    throw memberError;
  }

  await supabase
    .from("profiles")
    .update({
      family_role: roleLabel,
      organization: organization || null,
      status
    })
    .eq("user_id", context.appUserId);

  revalidatePath("/", "layout");
  redirect("/home");
}

export async function quickDemoLoginAction() {
  if (!isSupabaseConfigured()) {
    redirect("/home");
  }

  const supabase = await createClient();
  const email = process.env.DEMO_USER_EMAIL;
  const password = process.env.DEMO_USER_PASSWORD;

  if (!email || !password) {
    redirect("/home");
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (!error) {
    await getCurrentAppContext();
  }

  revalidatePath("/", "layout");
  redirect("/home");
}
