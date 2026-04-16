import { cookies } from "next/headers";
import { getSupabaseServerEnv } from "@/lib/server-env";

export type AppMode = "auto" | "demo" | "live";

export const APP_MODE_COOKIE = "kazoq-mode";

export function isSupabaseConfigured() {
  const { url, clientKey } = getSupabaseServerEnv();

  return Boolean(url && clientKey);
}

export function isSupabaseAdminConfigured() {
  const { url, serviceRoleKey } = getSupabaseServerEnv();

  return Boolean(url && serviceRoleKey);
}

export function normalizeAppMode(value?: string | null): AppMode {
  if (value === "demo" || value === "live" || value === "auto") {
    return value;
  }

  return "auto";
}

export function resolveAppMode(preferredMode?: string | null): Exclude<AppMode, "auto"> {
  const requestedMode = normalizeAppMode(preferredMode);

  // If Supabase is configured, prefer live mode over a stale demo cookie.
  if (requestedMode === "demo" && isSupabaseConfigured()) {
    return "live";
  }

  if (requestedMode !== "auto") {
    return requestedMode;
  }

  const configuredMode = normalizeAppMode(process.env.NEXT_PUBLIC_DEFAULT_APP_MODE);

  if (configuredMode !== "auto") {
    return configuredMode;
  }

  return isSupabaseConfigured() ? "live" : "demo";
}

export async function getServerAppMode() {
  const cookieStore = await cookies();

  return resolveAppMode(cookieStore.get(APP_MODE_COOKIE)?.value);
}

export async function shouldUseDemoData() {
  return (await getServerAppMode()) === "demo";
}
