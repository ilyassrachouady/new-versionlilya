"use server";

import { redirect } from "next/navigation";

import { isAllowedAdminEmail, resolveAdminProfile } from "@/lib/admin-auth";
import { supabaseConfigState } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type AdminLoginState = { ok: boolean; message: string } | null;

function safeNext(value: string) {
  return value.startsWith("/admin") && !value.startsWith("/admin/login") ? value : "/admin";
}

export async function signInAdmin(_prev: AdminLoginState, formData: FormData): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Indiquez une adresse e-mail valide." };
  }
  if (!password) {
    return { ok: false, message: "Indiquez votre mot de passe." };
  }
  if (!supabaseConfigState.publicReady) {
    return { ok: false, message: "Supabase n’est pas configuré sur ce serveur." };
  }

  // Reject every address that is not explicitly present in ADMIN_EMAILS.
  // Keep the response generic so the allowlist cannot be enumerated.
  if (!isAllowedAdminEmail(email)) {
    return { ok: false, message: "E-mail ou mot de passe incorrect." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    if (error) console.error("Admin password login", error.message);
    return { ok: false, message: "E-mail ou mot de passe incorrect." };
  }

  // Defence in depth: the authenticated Supabase user must still be allowlisted.
  if (!isAllowedAdminEmail(data.user.email)) {
    await supabase.auth.signOut();
    return { ok: false, message: "E-mail ou mot de passe incorrect." };
  }

  const profile = await resolveAdminProfile(data.user);
  if (!profile) {
    await supabase.auth.signOut();
    return { ok: false, message: "Ce compte n’a pas accès au bureau." };
  }

  redirect(safeNext(String(formData.get("next") ?? "/admin")));
}

export async function signOutAdmin() {
  if (!supabaseConfigState.publicReady) redirect("/admin/login");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
