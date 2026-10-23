"use server";
import { revalidatePath, updateTag } from "next/cache";
import { requireLocalAdminClient } from "@/lib/admin-access";
import { contentDefault, contentSources, fields, type ContentKey } from "@/lib/content-model";
import type { Json } from "@/lib/supabase/database.types";
export type ContentState = { error?: string; success?: string } | null;
export async function saveContent(key: ContentKey, _state: ContentState, form: FormData): Promise<ContentState> {
  try {
    const client = await requireLocalAdminClient();
    if (!Object.hasOwn(contentSources, key)) throw new Error("Section inconnue.");
    if (form.get("reviewed") !== "on") throw new Error("Vérifiez les trois traductions avant publication.");
    const rows = (["fr", "en", "ar"] as const).map(locale => {
      const body = structuredClone(contentDefault(key, locale)) as Record<string, unknown>;
      for (const field of fields(body)) {
        const value = form.get(`${locale}:${field.path}`);
        if (typeof value !== "string" || value.length > 20000) throw new Error("Champ manquant ou trop long.");
        const parts = field.path.split(".");
        let node = body;
        for (const part of parts.slice(0, -1)) node = node[part] as Record<string, unknown>;
        node[parts.at(-1)!] = value.trim();
      }
      if (key === "contact") {
        for (const field of ["email", "secondaryEmail"]) {
          const email = String(body[field] ?? "");
          if ((field === "email" || email) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Adresse e-mail invalide.");
        }
        const url = new URL(String(body.instagram));
        if (url.protocol !== "https:" || !["instagram.com", "www.instagram.com"].includes(url.hostname)) throw new Error("Utilisez un lien Instagram HTTPS valide.");
      }
      return { key: `store:${key}`, locale, body: body as Json, status: "published", published_at: new Date().toISOString() };
    });
    const { error } = await client.from("content_entries").upsert(rows, { onConflict: "key,locale" });
    if (error) throw new Error(error.message);
    updateTag("storefront-content");
    revalidatePath("/[locale]", "layout");
    revalidatePath("/admin/content");
    return { success: "Les trois langues sont publiées. Le cache de la boutique a été actualisé." };
  } catch (error) {
    if (error && typeof error === "object" && "digest" in error && String(error.digest).startsWith("NEXT_REDIRECT")) throw error;
    return { error: error instanceof Error ? error.message : "Publication impossible." };
  }
}
