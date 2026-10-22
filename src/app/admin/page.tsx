import Link from "next/link";
import { AlertTriangle, ArrowRight, Boxes, Database, PackageCheck, ShoppingBag } from "lucide-react";

import { AdminMedia, MetricCard, PageHeader, SectionTitle, StatusBadge } from "@/components/dashboard/AdminUI";
import { getAdminSession } from "@/lib/admin-auth";
import { getAdminProducts } from "@/lib/admin-products";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatMoney, legacyMadToEur } from "@/lib/currency";

function metadataValue(metadata: unknown, key: string) {
  return metadata && typeof metadata === "object" && key in metadata
    ? String((metadata as Record<string, unknown>)[key] ?? "")
    : "";
}

function greeting(hour: number) {
  if (hour < 12) return "Bonjour";
  if (hour < 18) return "Bon après-midi";
  return "Bonsoir";
}

function firstName(fullName: string) {
  return fullName.split(/\s+/)[0] ?? fullName;
}

export default async function AdminOverviewPage() {
  const [products, adminSession] = await Promise.all([getAdminProducts(), getAdminSession()]);
  const active = products.filter((product) => product.status === "active");
  const alerts = products
    .filter((product) => product.stock_quantity <= product.low_stock_threshold)
    .sort((a, b) => a.stock_quantity - b.stock_quantity);
  const healthy = Math.max(0, products.length - alerts.length);
  const totalStock = products.reduce((sum, product) => sum + product.stock_quantity, 0);
  const client = createAdminClient();
  let ordersResult: { data: { id: string; total: number; currency: string; status: string; created_at: string }[] | null; count: number | null } = {
    data: [],
    count: 0,
  };
  let customersResult: { count: number | null } = { count: 0 };
  let collectionsResult: { count: number | null } = { count: 0 };
  if (client) {
    try {
      [ordersResult, customersResult, collectionsResult] = await Promise.all([
        client.from("orders").select("id,total,currency,status,created_at", { count: "exact" }).order("created_at", { ascending: false }).limit(5),
        client.from("customers").select("id", { count: "exact", head: true }),
        client.from("collections").select("id", { count: "exact", head: true }),
      ]);
    } catch {
      // Keep the dashboard usable when Supabase is temporarily unreachable.
    }
  }
  const recentOrders = ordersResult.data ?? [];
  const revenue = recentOrders.reduce((sum, order) => sum + (order.currency === "MAD" ? legacyMadToEur(Number(order.total)) : Number(order.total)), 0);
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", { timeZone: "Africa/Casablanca", hour: "2-digit", hour12: false }).format(new Date()),
  );
  const today = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Africa/Casablanca",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date());
  const featured = [...products].sort((a, b) => {
    const alertDelta =
      Number(a.stock_quantity <= a.low_stock_threshold) - Number(b.stock_quantity <= b.low_stock_threshold);
    if (alertDelta !== 0) return -alertDelta;
    return a.name.localeCompare(b.name, "fr");
  });

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Bureau de la Maison"
        title={`${greeting(hour)}${adminSession ? `, ${firstName(adminSession.fullName)}` : ""}.`}
        description={`L’essentiel du catalogue et du stock, ${today}. Les commandes apparaissent ici dès qu’un panier est enregistré.`}
        actions={
          <Link
            href="/admin/products/new"
            className="admin-label inline-flex min-h-11 items-center rounded-xl bg-[#173d2c] px-5 text-[#f3e3d0] shadow-[0_10px_24px_rgba(23,61,44,.22)] transition hover:-translate-y-0.5 hover:bg-[#102d20]"
          >
            Ajouter un produit
          </Link>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard label="Produits actifs" value={String(active.length)} note="Publiés en boutique" accent="wine" />
        <MetricCard label="Unités en stock" value={totalStock.toLocaleString("fr-FR")} note="Toutes références" accent="forest" />
        <MetricCard
          label="Commandes"
          value={String(ordersResult.count ?? 0)}
          note={ordersResult.count ? "Enregistrées" : "En attente du premier paiement"}
          accent="gold"
        />
        <MetricCard
          label="Clients"
          value={String(customersResult.count ?? 0)}
          note={customersResult.count ? "Fiches créées" : "Aucun compte client pour l’instant"}
          accent="ink"
        />
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <article className="rounded-[1.35rem] border border-[#ded2c4] bg-[#fffaf2] p-5 shadow-[0_12px_34px_rgba(24,56,42,.07)] sm:p-7">
          <div className="flex items-center justify-between">
            <SectionTitle
              title="Santé du catalogue"
              note={`${products.length} produits · ${collectionsResult.count ?? 0} collections`}
            />
            <span className="flex size-10 items-center justify-center rounded-xl bg-[#e3ebe4]">
              <Database className="size-5 text-[#315c43]" />
            </span>
          </div>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-[#d8e3d8] bg-[#edf3ec] p-4">
              <Boxes className="size-5 text-[#315c43]" />
              <p className="admin-serif mt-5 text-3xl font-medium tracking-tight">{active.length}</p>
              <p className="mt-1 text-xs font-medium text-[#5a6d60]">Produits en ligne</p>
            </div>
            <div className="rounded-2xl border border-[#d3dfd4] bg-[#e5eee6] p-4">
              <PackageCheck className="size-5 text-[#315c43]" />
              <p className="admin-serif mt-5 text-3xl font-medium tracking-tight">{healthy}</p>
              <p className="mt-1 text-xs font-medium text-[#5a6d60]">Stocks sains</p>
            </div>
            <div className="rounded-2xl border border-[#e4d5bf] bg-[#f3e9d9] p-4">
              <AlertTriangle className="size-5 text-[#947044]" />
              <p className="admin-serif mt-5 text-3xl font-medium tracking-tight">{alerts.length}</p>
              <p className="mt-1 text-xs font-medium text-[#76634c]">Alertes à traiter</p>
            </div>
          </div>
          {alerts.length > 0 ? (
            <ul className="mt-5 divide-y divide-[#eadfce] rounded-2xl border border-[#eadfce] bg-[#fffdf8]">
              {alerts.slice(0, 4).map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/admin/products/${encodeURIComponent(product.sku)}`}
                    className="flex items-center justify-between gap-3 px-4 py-3 text-sm hover:bg-[#f6efe6]"
                  >
                    <span className="min-w-0 truncate font-medium">{product.name}</span>
                    <span className="shrink-0 text-xs text-[#92594e]">{product.stock_quantity} u.</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-5 text-sm text-[#6d7468]">Aucun seuil de stock n’est atteint.</p>
          )}
          <Link
            href="/admin/inventory"
            className="mt-5 flex items-center justify-between rounded-xl bg-[#173d2c] px-4 py-3.5 text-xs font-semibold text-[#f3e3d0] transition hover:bg-[#102d20]"
          >
            Ouvrir la gestion du stock <ArrowRight className="size-4" />
          </Link>
        </article>

        <aside className="rounded-[1.35rem] border border-[#ded2c4] bg-[#fffaf2] p-5 shadow-[0_12px_34px_rgba(24,56,42,.07)]">
          <SectionTitle title="À ouvrir" note="Priorité stock, puis le catalogue" />
          <div className="mt-5 space-y-2">
            {featured.slice(0, 5).map((product) => {
              const scent = metadataValue(product.metadata, "scent") || metadataValue(product.metadata, "collection");
              const low = product.stock_quantity <= product.low_stock_threshold;
              return (
                <Link
                  key={product.id}
                  href={`/admin/products/${encodeURIComponent(product.sku)}`}
                  className="group flex items-center gap-3 rounded-xl p-2 transition hover:bg-[#efe7dc]"
                >
                  <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-[#eadfce]">
                    {product.image_url && (
                      <AdminMedia src={product.image_url} className="object-cover transition group-hover:scale-105" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold">{product.name}</p>
                    <p className="mt-1 truncate text-[0.65rem] text-[#746e64]">
                      {[scent, product.sku].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <StatusBadge>{low ? "Stock bas" : product.status === "active" ? "Actif" : product.status}</StatusBadge>
                </Link>
              );
            })}
          </div>
        </aside>
      </section>

      <section className="rounded-[1.35rem] border border-[#ded7cf] bg-[#fffdf9] p-5 shadow-[0_12px_34px_rgba(54,39,29,.07)] sm:p-7">
        <div className="flex items-center justify-between">
          <SectionTitle title="Commandes récentes" note="Inyad n’envoie pas encore les paiements dans le bureau" />
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#f1e4df]">
            <ShoppingBag className="size-5 text-[#6b302b]" />
          </span>
        </div>
        {recentOrders.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#cfc3b7] bg-[#f8f4ef] px-6 py-9 text-center">
            <p className="text-sm font-semibold">Aucune commande pour le moment</p>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#776b62]">
              Le catalogue est prêt. Les commandes s’afficheront ici lorsqu’un paiement Inyad sera relié à une fiche.
            </p>
            <Link href="/fr/shop" className="admin-label mt-5 inline-flex min-h-10 items-center border-b border-[#88735d]/40 text-[#5d241f]">
              Ouvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="mt-5 overflow-x-auto">
            <table className="w-full">
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-t border-[#eee9e4] text-sm">
                    <td className="py-4 font-medium">{order.id.slice(0, 8)}</td>
                    <td className="py-4">{formatMoney(Number(order.total), order.currency)}</td>
                    <td className="py-4">
                      <StatusBadge>{order.status}</StatusBadge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-end text-sm font-semibold">Total récent : {formatMoney(revenue)}</p>
          </div>
        )}
      </section>
    </div>
  );
}
