import "server-only";
import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { contentDefault, contentSources, hydrate, merge, type ContentKey } from "@/lib/content-model";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getV2Copy } from "@/lib/v2-content";
import { signatureCopy } from "@/lib/signature-collections";
import * as editorial from "@/lib/content";
import type { Locale } from "@/lib/i18n/config";
import { getPublicSupabaseConfig, supabaseConfigState } from "@/lib/supabase/config";
import { fetchWithSupabaseTimeout } from "@/lib/supabase/fetch-with-timeout";
import type { Database } from "@/lib/supabase/database.types";

const entries = cache(unstable_cache(async () => {
  if (!supabaseConfigState.publicReady) return [];
  const { url, publishableKey } = getPublicSupabaseConfig();
  const client = createClient<Database>(url, publishableKey, { auth: { persistSession: false }, global: { fetch: fetchWithSupabaseTimeout } });
  const { data, error } = await client.from("content_entries").select("key,locale,body").eq("status", "published").like("key", "store:%");
  if (error) { console.error("Storefront content", error.message); return []; }
  return data ?? [];
}, ["storefront-content-v1"], { tags: ["storefront-content"], revalidate: 120 }));
export async function managedContent(key: ContentKey, locale: Locale) {
  const entry = (await entries()).find(row => row.key === `store:${key}` && row.locale === locale);
  return merge(contentDefault(key, locale), entry?.body);
}
export async function getStorefrontDictionary(locale: Locale) { return merge(getDictionary(locale), await managedContent("dictionary", locale)); }
export async function getStorefrontHomeCopy(locale: Locale) { return merge(getV2Copy(locale), await managedContent("home", locale)); }
export async function getStorefrontSignatureCopy(locale: Locale) { return merge(signatureCopy(locale), await managedContent("signatures", locale)); }
export async function getStorefrontWorlds(locale: Locale) { return merge(contentSources.worlds(locale), await managedContent("worlds", locale)); }
export async function getStorefrontEditorial(locale: Locale) {
  const base = { rituals: editorial.rituals, articles: editorial.articles, ingredients: editorial.ingredients, edits: editorial.edits, needs: editorial.needs };
  return hydrate(base, await managedContent("editorial", locale), locale);
}
