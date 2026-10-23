"use client";
import { useActionState, useState } from "react";
import { fields } from "@/lib/content-fields";
import type { Locale } from "@/lib/i18n/config";
import type { ContentState } from "@/app/admin/content/actions";
import { SubmitButton } from "./SubmitButton";
export function ContentEditor({ values, action, focus = "" }: { values: Record<Locale, unknown>; focus?: string; action: (state: ContentState, form: FormData) => Promise<ContentState> }) {
  const [state, formAction] = useActionState(action, null);
  const [locale, setLocale] = useState<Locale>("fr");
  const [query, setQuery] = useState(focus);
  return <form action={formAction} className="space-y-5">
    <p className="text-sm">Modifiez chaque langue séparément. Aucune traduction automatique n’est effectuée. Vérifiez les trois versions avant de publier.</p>
    <div className="flex gap-3">{(["fr", "en", "ar"] as const).map(lang => <button type="button" key={lang} aria-pressed={locale === lang} onClick={() => setLocale(lang)} className={`rounded border px-4 py-2 ${locale === lang ? "bg-[#173326] text-white" : ""}`}>{({ fr: "Français", en: "English", ar: "العربية" })[lang]}</button>)}</div>
    <label className="block text-sm">Rechercher un champ<input value={query} onChange={event => setQuery(event.target.value)} className="mt-2 block w-full rounded border bg-white p-3" /></label>
    {(["fr", "en", "ar"] as const).map(lang => <div key={lang} hidden={locale !== lang} lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="space-y-5">{fields(values[lang]).map(field => <label key={field.path} hidden={Boolean(query) && !`${field.path} ${field.value}`.toLowerCase().includes(query.toLowerCase())} className="block text-sm"><span dir="ltr" className="block text-start font-medium">{field.path}</span><textarea name={`${lang}:${field.path}`} defaultValue={field.value} maxLength={20000} rows={field.value.length > 130 ? 5 : 2} className="mt-2 w-full rounded border bg-white p-3 leading-relaxed" /></label>)}</div>)}
    <label className="flex gap-3 text-sm"><input type="checkbox" name="reviewed" required />J’ai vérifié les versions française, anglaise et arabe.</label>
    {state?.error && <p role="alert" className="text-red-700">{state.error}</p>}{state?.success && <p role="status" className="text-green-800">{state.success}</p>}
    <SubmitButton>Publier les trois langues</SubmitButton>
  </form>;
}
