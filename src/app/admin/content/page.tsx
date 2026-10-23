import Link from "next/link";
import { PageHeader } from "@/components/dashboard/AdminUI";
import { ContentEditor } from "@/components/dashboard/ContentEditor";
import { requireLocalAdminClient } from "@/lib/admin-access";
import { contentDefault, contentSources, contentTitles, merge, type ContentKey } from "@/lib/content-model";
import { saveContent } from "./actions";
export default async function ContentPage({ searchParams }: { searchParams: Promise<{ section?: string; focus?: string }> }) {
  const { section, focus } = await searchParams;
  const key: ContentKey = section && Object.hasOwn(contentSources, section) ? section as ContentKey : "home";
  const client = await requireLocalAdminClient();
  const { data, error } = await client.from("content_entries").select("locale,body").eq("key", `store:${key}`).eq("status", "published");
  const values = Object.fromEntries((["fr", "en", "ar"] as const).map(locale => [locale, merge(contentDefault(key, locale), data?.find(row => row.locale === locale)?.body)])) as Record<"fr" | "en" | "ar", unknown>;
  return <div className="space-y-8"><PageHeader eyebrow="Éditorial" title="Contenu multilingue" description="Les textes publiés ici alimentent directement la boutique. Les produits se modifient dans Produits." /><nav className="flex flex-wrap gap-3">{(Object.keys(contentTitles) as ContentKey[]).map(id => <Link key={id} href={`/admin/content?section=${id}`} aria-current={key === id ? "page" : undefined} className={`rounded border p-3 text-sm ${key === id ? "bg-[#173326] text-white" : "bg-white"}`}>{contentTitles[id]}</Link>)}</nav>{error ? <p role="alert">Lecture impossible : {error.message}</p> : <section className="rounded border bg-[#f9f5ef] p-5 sm:p-8"><h2 className="mb-6 text-xl">{contentTitles[key]}</h2><ContentEditor key={`${key}:${focus ?? ""}`} focus={focus?.slice(0, 100)} values={values} action={saveContent.bind(null, key)} /></section>}</div>;
}
