import { notFound } from "next/navigation";
import { MapPin } from "lucide-react";

import { PageHeader, SectionTitle, StatusBadge } from "@/components/dashboard/AdminUI";
import { getAdminOrder } from "@/lib/admin-commerce";
import { formatMoney } from "@/lib/currency";

export default async function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getAdminOrder(decodeURIComponent(id));
  if (!order) notFound();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Commande"
        title={order.id}
        description={`Passée le ${order.date} · Boutique en ligne`}
        actions={<StatusBadge>{order.status}</StatusBadge>}
      />
      <div className="grid gap-7 xl:grid-cols-[1.35fr_.65fr]">
        <div className="space-y-7">
          <section className="border border-[#d8cfc1] bg-[#f9f5ef] p-6">
            <SectionTitle title="Produits achetés" note={`${order.items.length} ligne${order.items.length === 1 ? "" : "s"}`} />
            <div className="mt-5 divide-y divide-[#ddd4c8]">
              {order.items.map((item) => (
                <div key={`${item.sku}-${item.name}`} className="grid grid-cols-[1fr_auto] gap-4 py-4">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="mt-1 text-xs text-[#8a7d72]">
                      {item.sku} · Qté {item.quantity}
                    </p>
                  </div>
                  <p className="admin-serif text-lg">{formatMoney(item.unitPrice * item.quantity, order.currency)}</p>
                </div>
              ))}
            </div>
            <dl className="ms-auto mt-4 max-w-sm space-y-3 border-t border-[#d8cfc1] pt-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#82766c]">Sous-total</dt>
                <dd>{formatMoney(order.subtotal, order.currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#82766c]">Livraison</dt>
                <dd>{formatMoney(order.shipping, order.currency)}</dd>
              </div>
              <div className="flex justify-between border-t border-[#d8cfc1] pt-4 admin-serif text-xl">
                <dt>Total</dt>
                <dd>{formatMoney(order.total, order.currency)}</dd>
              </div>
            </dl>
          </section>
        </div>
        <aside className="space-y-7">
          <section className="border border-[#d8cfc1] bg-[#f9f5ef] p-6">
            <SectionTitle title="Client" />
            <p className="mt-5 font-medium">{order.customer}</p>
            <p className="mt-1 text-sm text-[#786d64]">{order.email}</p>
            {order.phone ? <p className="mt-1 text-sm text-[#786d64]">{order.phone}</p> : null}
          </section>
          <section className="border border-[#d8cfc1] bg-[#f9f5ef] p-6">
            <SectionTitle title="Livraison" />
            <div className="mt-5 flex gap-3 text-sm leading-6 text-[#665c54]">
              <MapPin className="mt-1 size-4 shrink-0" />
              <address className="not-italic">
                {order.customer}
                <br />
                {order.line1}
                {order.city ? (
                  <>
                    <br />
                    {order.city}
                  </>
                ) : null}
                <br />
                {order.country}
              </address>
            </div>
          </section>
          <section className="border border-[#d8cfc1] bg-[#f9f5ef] p-6">
            <SectionTitle title="Paiement" />
            <dl className="mt-5 space-y-4 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#81756b]">Statut</dt>
                <dd>
                  <StatusBadge>{order.payment}</StatusBadge>
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[#81756b]">Méthode</dt>
                <dd>Inyad · saisie du montant</dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </div>
  );
}
