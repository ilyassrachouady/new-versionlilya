import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import type { AdminProfile, AdminRole } from "@/lib/admin-types";
import { createAdminClient } from "@/lib/supabase/admin";
import { supabaseConfigState } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type { AdminProfile, AdminRole };

function isAdminRole(role: string): role is AdminRole {
  return role === "owner" || role === "admin";
}

function allowedEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);
}

export function isAllowedAdminEmail(email: string | null | undefined) {
  const normalized = email?.trim().toLowerCase() ?? "";
  return normalized.length > 0 && allowedEmails().includes(normalized);
}

function displayName(user: User) {
  const fromMeta =
    typeof user.user_metadata?.full_name === "string" ? user.user_metadata.full_name.trim() : "";
  return fromMeta || user.email?.split("@")[0] || "Maison";
}

function toProfile(user: User, fullName: string | null, role: AdminRole): AdminProfile | null {
  if (!user.email) return null;
  return {
    id: user.id,
    email: user.email,
    fullName: fullName?.trim() || displayName(user),
    role,
  };
}

async function readProfile(userId: string) {
  const admin = createAdminClient();
  const client = admin ?? (supabaseConfigState.publicReady ? await createClient() : null);
  if (!client) return null;

  const { data, error } = await client.from("profiles").select("full_name, role").eq("id", userId).maybeSingle();
  if (error) {
    console.error("Admin profile lookup", error.message);
    return null;
  }
  return data;
}

async function provisionOwner(user: User) {
  const admin = createAdminClient();
  if (!admin) return null;

  const { count } = await admin.from("profiles").select("id", { count: "exact", head: true }).in("role", ["owner", "admin"]);
  const allowlisted = isAllowedAdminEmail(user.email);
  const firstAdmin = (count ?? 0) === 0;
  if (!allowlisted && !firstAdmin) return null;

  const fullName = displayName(user);
  const { error } = await admin.from("profiles").upsert(
    { id: user.id, full_name: fullName, role: "owner" },
    { onConflict: "id" },
  );
  if (error) {
    console.error("Admin profile provision", error.message);
    return null;
  }
  return toProfile(user, fullName, "owner");
}

export async function resolveAdminProfile(user: User): Promise<AdminProfile | null> {
  const existing = await readProfile(user.id);
  if (existing && isAdminRole(existing.role)) {
    return toProfile(user, existing.full_name, existing.role);
  }

  // An allowlisted user may already have a default `staff` profile. In that case,
  // promote it instead of rejecting access.
  if (existing && !isAllowedAdminEmail(user.email)) return null;

  return provisionOwner(user);
}

export const getAdminSession = cache(async (): Promise<AdminProfile | null> => {
  if (!supabaseConfigState.publicReady) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  return resolveAdminProfile(user);
});

export async function requireAdminSession() {
  const admin = await getAdminSession();
  if (!admin) redirect("/admin/login");
  return admin;
}

export async function requireAdminClient() {
  await requireAdminSession();
  const client = createAdminClient();
  if (!client) {
    throw new Error("Ajoutez SUPABASE_SECRET_KEY dans .env.local pour activer les modifications.");
  }
  return client;
}
