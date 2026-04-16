import "server-only";

import fs from "node:fs";
import path from "node:path";

type ServerEnv = {
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
};

let cachedEnv: ServerEnv | null = null;

function parseEnvLine(line: string) {
  const trimmed = line.trim();

  if (!trimmed || trimmed.startsWith("#")) {
    return null;
  }

  const separatorIndex = trimmed.indexOf("=");

  if (separatorIndex === -1) {
    return null;
  }

  const key = trimmed.slice(0, separatorIndex).trim();
  let value = trimmed.slice(separatorIndex + 1).trim();

  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }

  return { key, value };
}

function loadEnvFile() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const envPath = path.join(process.cwd(), ".env.local");
  const result: ServerEnv = {};

  try {
    const file = fs.readFileSync(envPath, "utf8");

    for (const line of file.split(/\r?\n/)) {
      const parsed = parseEnvLine(line);

      if (!parsed) {
        continue;
      }

      if (parsed.key in result) {
        continue;
      }

      if (
        parsed.key === "NEXT_PUBLIC_SUPABASE_URL" ||
        parsed.key === "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY" ||
        parsed.key === "NEXT_PUBLIC_SUPABASE_ANON_KEY" ||
        parsed.key === "SUPABASE_SERVICE_ROLE_KEY"
      ) {
        result[parsed.key] = parsed.value;
      }
    }
  } catch {
    // Keep result empty when .env.local is unavailable.
  }

  cachedEnv = result;
  return result;
}

export function getServerEnvValue(key: keyof ServerEnv) {
  return process.env[key] ?? loadEnvFile()[key];
}

export function getSupabaseServerEnv() {
  const url = getServerEnvValue("NEXT_PUBLIC_SUPABASE_URL");
  const publishableKey = getServerEnvValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  const anonKey = getServerEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY");
  const serviceRoleKey = getServerEnvValue("SUPABASE_SERVICE_ROLE_KEY");

  return {
    url,
    publishableKey,
    anonKey,
    serviceRoleKey,
    clientKey: publishableKey ?? anonKey
  };
}
