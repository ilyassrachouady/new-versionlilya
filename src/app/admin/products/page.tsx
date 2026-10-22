import Link from "next/link";
import { Download, Plus, Search } from "lucide-react";

import { AdminMedia, PageHeader, StatusBadge } from "@/components/dashboard/AdminUI";
import { getAdminProducts } from "@/lib/admin-products";

function metadataValue(metadata: unknown, key: string) {
  return metadata && typeof metadata === "object" && key in metadata ? String((metadata as Record<string, unknown>)[key] ?? "") : "";
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ q?: string; succes?: string }> }) {
  const params = await searchParams;
  const query = params.q ?? "";
  const products = await getAdminProducts(query);
  return <div className="space-y-7">
    <PageHeader eyebrow="Catalogue · 02" title="Produits" description="Catalogue Supabase — prix, images, publication et disponibilité en temps réel." actions={<><Link href="/admin/products/export" className="admin-label inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#d8c8b5] bg-[#fffaf2] px-4"><Download className="size-4" />Exporter</Link><Link href="/admin/products/new" className="admin-label inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#173d2c] bg-[#173d2c] px-4 text-[#f3e3d0]"><Plus className="size-4" />Nouveau produit</Link></>} />
    {params.succes && <p role="status" className="rounded-xl border border-[#cad6c6] bg-[#edf2ea] px-4 py-3 text-sm text-[#536650]">Modification enregistrée dans Supabase.</p>}
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"><form className="relative block min-w-[15rem] sm:max-w-md sm:flex-1"><Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[#9a8e84]" /><input name="q" defaultValue={query} className="h-11 w-full rounded-xl border border-[#dfdad4] bg-white ps-10 pe-3 text-sm outline-none focus:border-[#9a786b]" placeholder="Rechercher un produit ou un SKU" /></form><p className="admin-label text-[#8a7d72]">{products.length} produit{products.length > 1 ? "s" : ""}</p></div>
    {products.length === 0 ? <div className="rounded-2xl border border-dashed border-[#cfc4b4] px-8 py-16 text-center"><p className="text-xl font-semibold">Aucun produit trouvé</p><Link href="/admin/products" className="mt-3 inline-block text-sm text-[#5d241f] underline">Effacer la recherche</Link></div> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{products.map((product, index) => <Link key={product.id} href={`/admin/products/${encodeURIComponent(product.sku)}`} className="group rounded-2xl border border-[#e5e0db] bg-white p-4 shadow-[0_8px_24px_rgba(44,32,24,0.035)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(44,32,24,0.07)]"><div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[#e8dccb]">{product.image_url ? <AdminMedia src={product.image_url} className="object-cover transition duration-700 group-hover:scale-[1.025]" /> : <div className="flex h-full items-center justify-center text-xs text-[#8d8177]">Aucune image</div>}<span className="admin-serif absolute start-4 top-4 flex size-8 items-center justify-center rounded-full bg-white/85 text-sm text-[#4b3b31] backdrop-blur">{String(index + 1).padStart(2, "0")}</span></div><div className="mt-4 flex items-start justify-between gap-4"><div><h2 className="text-lg font-semibold tracking-[-0.02em]">{product.name}</h2><p className="mt-1 text-xs text-[#84776d]">{metadataValue(product.metadata, "scent") || product.slug}</p></div><StatusBadge>{product.status === "active" ? "Actif" : product.status === "draft" ? "Brouillon" : "Archivé"}</StatusBadge></div><div className="mt-4 flex justify-between border-t border-[#eee9e4] pt-4 text-xs"><span className="font-semibold">{product.price_eur.toFixed(2)} EUR</span><span className={product.stock_quantity <= product.low_stock_threshold ? "text-[#92594e]" : "text-[#71665d]"}>{product.stock_quantity} unités</span></div></Link>)}</div>}
  </div>;
}
