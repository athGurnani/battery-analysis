import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

function getUrl() {
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  const url = rawUrl.replace(/\/rest\/v1\/?$/, "").replace(/\/$/, "");
  if (!url || !url.includes(".supabase.co")) {
    throw new Error(
      "Set NEXT_PUBLIC_SUPABASE_URL to your Supabase project URL (e.g. https://<ref>.supabase.co)"
    );
  }
  return url;
}

const url = getUrl();

export function getServerClient() {
  const key = process.env.SUPABASE_SECRET_KEY?.trim();
  if (!key) {
    throw new Error(
      "Missing SUPABASE_SECRET_KEY (sb_secret_...) in .env.local for server-side operations"
    );
  }
  return createClient<Database>(url, key);
}
