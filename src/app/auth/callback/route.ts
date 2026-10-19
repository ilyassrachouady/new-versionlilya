import { NextResponse, type NextRequest } from "next/server";

import { resolveAdminProfile } from "@/lib/admin-auth";
import { supabaseConfigState } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

function safeNext(value: string | null) {
  if (!value?.startsWith("/admin") || value.startsWith("//") || value.startsWith("/admin/login")) return "/admin";
  return value;
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const next = safeNext(searchParams.get("next"));
  const login = new URL("/admin/login", origin);

  if (!supabaseConfigState.publicReady) {
    login.searchParams.set("erreur", "config");
    return NextResponse.redirect(login);
  }

  const supabase = await createClient();
  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      login.searchParams.set("erreur", "lien");
      return NextResponse.redirect(login);
    }
  } else if (tokenHash && (type === "email" || type === "magiclink")) {
    const { error } = await supabase.auth.verifyOtp({
      type: "magiclink",
      token_hash: tokenHash,
    });
    if (error) {
      login.searchParams.set("erreur", "lien");
      return NextResponse.redirect(login);
    }
  } else {
    login.searchParams.set("erreur", "lien");
    return NextResponse.redirect(login);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    login.searchParams.set("erreur", "lien");
    return NextResponse.redirect(login);
  }

  const profile = await resolveAdminProfile(user);
  if (!profile) {
    await supabase.auth.signOut();
    login.searchParams.set("erreur", "acces");
    return NextResponse.redirect(login);
  }

  return NextResponse.redirect(new URL(next, origin));
}
