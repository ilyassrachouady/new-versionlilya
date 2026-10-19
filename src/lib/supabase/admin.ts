import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { fetchWithSupabaseTimeout } from "@/lib/supabase/fetch-with-timeout";
import { getServerSupabaseConfig, supabaseConfigState } from "@/lib/supabase/config";

export function createAdminClient() {
  if (!supabaseConfigState.serverReady) return null;

  const { url, secretKey } = getServerSupabaseConfig();
  return createClient<Database>(url, secretKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { fetch: fetchWithSupabaseTimeout },
  });
}
