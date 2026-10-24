"use client";

import { useActionState, useState } from "react";
import { catalogProducts } from "@/lib/catalog";
import type { AdminProduct } from "@/lib/admin-products";
import { saveProductTexts } from "@/app/admin/products/actions";
import { SubmitButton } from "./SubmitButton";

const labels = { name: "Nom", tagline: "Accroche", description: "Description", ritualNote: "Note de rituel", howToUse: "Conseils d’utilisation", vessel: "Flacon / contenant" };
const languages = { fr: "Français", en: "English", ar: "العربية" };

/** All language panels stay mounted so switching tabs never discards edits. */
export function ProductTranslations({ product, standalone = false }: { product?: AdminProduct | null; standalone?: boolean }) {
  const [locale, setLocale] = useState<keyof typeof languages>("fr");
  const base = product ? catalogProducts.find(item => item.sku === product.sku || item.slug === product.slug) : undefined;
  const metadata = product?.metadata as { localized?: Record<string, Record<string, string>> } | undefined;
  return <section id="product-texts" className="scroll-mt-24 rounded-2xl border bg-white p-6">
    <h2 className="text-lg">Textes et traductions</h2>
    <p className="mt-2 text-sm text-[#81756b]">{standalone ? "Enregistrez les textes ici, sans modifier le prix ni le stock. Passez d’une langue à l’autre sans perdre vos saisies." : "Le nom et la description français se modifient dans les champs principaux. Complétez les traductions avant la création."}</p>
    <div role="group" aria-label="Langue des textes" className="my-5 flex flex-wrap gap-2">{(Object.keys(languages) as (keyof typeof languages)[]).map(lang => <button key={lang} type="button" aria-pressed={locale === lang} onClick={() => setLocale(lang)} className={`min-h-11 rounded-lg border px-4 text-sm ${locale === lang ? "bg-[#173326] text-white" : "bg-white"}`}>{languages[lang]}</button>)}</div>
    {(Object.keys(languages) as (keyof typeof languages)[]).map(lang => <div key={lang} hidden={locale !== lang} lang={lang} dir={lang === "ar" ? "rtl" : "ltr"} className="space-y-4">{(Object.keys(labels) as (keyof typeof labels)[]).filter(key => standalone || lang !== "fr" || !["name", "description"].includes(key)).map(key => {
      const primary = lang === "fr" && (key === "name" || key === "description");
      const value = primary ? product?.[key as "name" | "description"] ?? metadata?.localized?.[key]?.[lang] ?? base?.[key][lang] ?? "" : metadata?.localized?.[key]?.[lang] ?? base?.[key][lang] ?? "";
      return <label key={key} className="block text-sm">{labels[key]}<textarea name={primary ? key : `localized:${key}:${lang}`} defaultValue={value} maxLength={20000} rows={key === "description" ? 5 : 2} className="mt-2 w-full rounded-lg border bg-white p-3 leading-relaxed" /></label>;
    })}</div>)}
    <label className="mt-5 flex items-start gap-3 text-sm"><input type="checkbox" name="translations_reviewed" required className="mt-1" />J’ai vérifié les textes en français, anglais et arabe.</label>
  </section>;
}

export function ProductTextEditor({ product }: { product: AdminProduct }) {
  const [state, action] = useActionState(saveProductTexts.bind(null, product.id), null);
  return <form action={action} className="space-y-3">
    <ProductTranslations product={product} standalone />
    <div className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border bg-white p-4 shadow-lg">
      <div className="text-sm" aria-live="polite">{state?.error ? <p role="alert" className="text-red-700">{state.error}</p> : state?.success ? <p role="status" className="text-green-800">{state.success}</p> : <p className="text-[#81756b]">Sauvegarde indépendante du prix et du stock.</p>}</div>
      <SubmitButton pendingLabel="Enregistrement des textes…">Enregistrer les textes · FR / EN / AR</SubmitButton>
    </div>
  </form>;
}
