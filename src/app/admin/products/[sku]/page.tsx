import { notFound } from "next/navigation";

import { archiveProduct, updateProduct } from "@/app/admin/products/actions";
import { PageHeader, StatusBadge } from "@/components/dashboard/AdminUI";
import { ProductForm } from "@/components/dashboard/ProductForm";
import { getAdminProduct } from "@/lib/admin-products";

export default async function ProductEditor({ params, searchParams }: { params: Promise<{ sku: string }>; searchParams: Promise<{ succes?: string }> }) {
  const { sku } = await params;
  const query = await searchParams;
  const product = await getAdminProduct(decodeURIComponent(sku));
  if (!product) notFound();
  return <div className="space-y-8"><PageHeader eyebrow="Produit Supabase" title={product.name} description={`${product.sku} · ${product.slug}`} actions={<StatusBadge>{product.status === "active" ? "Actif" : product.status}</StatusBadge>} />{query.succes && <p className="rounded-xl border border-[#cad6c6] bg-[#edf2ea] px-4 py-3 text-sm text-[#536650]">Produit enregistré avec succès.</p>}<ProductForm product={product} action={updateProduct.bind(null, product.id)} archiveAction={archiveProduct.bind(null, product.id)} /></div>;
}
