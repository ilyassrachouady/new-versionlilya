import Link from "next/link";
import { PageHeader } from "@/components/dashboard/AdminUI";
import { getStorefrontEditorial } from "@/lib/storefront-content";
export default async function CollectionsPage() {
  const { rituals } = await getStorefrontEditorial("fr");
  return <div className="space-y-8"><PageHeader eyebrow="Catalogue · 03" title="Collections" description="Les textes des collections se publient en français, anglais et arabe. L’affectation des produits se modifie sur chaque fiche produit." /><div className="grid gap-5 lg:grid-cols-2">{rituals.map((ritual, index) => <section key={ritual.id} className="rounded-2xl border bg-white p-6"><h2 className="text-xl">{ritual.title.fr}</h2><p className="mt-3 text-sm leading-relaxed text-[#81756b]">{ritual.body.fr}</p><Link className="mt-5 inline-flex min-h-11 items-center rounded border px-4 text-sm" href={`/admin/content?section=editorial&focus=rituals.${index}`}>Modifier les textes · FR / EN / AR</Link></section>)}</div><Link href="/admin/content?section=signatures" className="inline-flex min-h-11 items-center rounded border bg-white px-4">Modifier les collections signatures</Link></div>;
}
