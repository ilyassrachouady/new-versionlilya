import { getAdminProducts } from "@/lib/admin-products";

const csv = (value: unknown) => `"${String(value ?? "").replaceAll('"', '""')}"`;
export async function GET() {
  const products = await getAdminProducts();
  const body = ["SKU,Nom,Slug,Prix MAD,Stock,Statut,Image", ...products.map((product) => [product.sku, product.name, product.slug, product.price_mad, product.stock_quantity, product.status, product.image_url].map(csv).join(","))].join("\n");
  return new Response(`\uFEFF${body}`, { headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=produits-maison-lilya-zahra.csv" } });
}
