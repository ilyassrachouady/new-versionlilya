import "server-only";

import { requireAdminClient } from "@/lib/admin-auth";

/** Writes require a signed-in owner or admin, then the server key. */
export async function requireLocalAdminClient() {
  return requireAdminClient();
}
