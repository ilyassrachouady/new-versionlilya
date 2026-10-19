"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { isAllowedAdminEmail } from "@/lib/admin-auth";
import { supabaseConfigState } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export type MagicLinkState = { sent: boolean; message: string } | null;

function requestOrigin(requestHeaders: Headers) {
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const proto =
    requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") || host.startsWith("127.0.0.1") ? "http" : "https");
  return `${proto}://${host}`;
}

export async function sendAdminMagicLink(_prev: MagicLinkState, formData: FormData): Promise<MagicLinkState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { sent: false, message: "Indiquez une adresse e-mail valide." };
  }
  if (!supabaseConfigState.publicReady) {
    return { sent: false, message: "Supabase n’est pas configuré. Ajoutez les clés dans .env.local." };
  }

  // Keep the response generic so the admin allowlist cannot be enumerated.
  if (!isAllowedAdminEmail(email)) {
    return {
      sent: true,
      message: "Si cette adresse est autorisée, un lien vient d’être envoyé. Ouvrez-le sur cet appareil.",
    };
  }

  const origin = requestOrigin(await headers());
  const nextRaw = String(formData.get("next") ?? "/admin");
  const next = nextRaw.startsWith("/admin") && !nextRaw.startsWith("/admin/login") ? nextRaw : "/admin";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
    },
  });

  if (error) {
    console.error("Admin magic link", error.message);
    return { sent: false, message: "Le lien n’a pas pu être envoyé. Réessayez dans un moment." };
  }

  return {
    sent: true,
    message: "Si cette adresse est autorisée, un lien vient d’être envoyé. Ouvrez-le sur cet appareil.",
  };
}

export async function signOutAdmin() {
  if (!supabaseConfigState.publicReady) redirect("/admin/login");
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
