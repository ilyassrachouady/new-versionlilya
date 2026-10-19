import Link from "next/link";

import { PageHeader, StatusBadge } from "@/components/dashboard/AdminUI";
import { getAdminOrders } from "@/lib/admin-commerce";

export default async function OrdersPage() {
  const orders = await getAdminOrders();

  return (
    <div className="space-y-7">
      <PageHeader
        eyebrow="Commerce · 01"
        title="Commandes"
        description="Commandes enregistrées depuis la boutique, avant et après le paiement Inyad."
      />

      <section className="overflow-hidden rounded-2xl border border-[#e5e0db] bg-white shadow-[0_8px_24px_rgba(44,32,24,0.035)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[62rem]">
            <thead className="bg-[#faf9f7]">
              <tr className="text-[0.65rem] font-medium text-[#8d8075]">
                {["N° de commande", "Client", "Articles", "Pays", "Total", "Paiement", "Traitement", "Date"].map((item) => (
                  <th key={item} className="border-b border-[#ece7e2] px-4 py-4 text-start font-medium uppercase tracking-[0.08em]">
                    {item}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#eee9e4]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-sm text-[#82766c]">
                    Aucune commande pour le moment. Elles apparaîtront ici dès qu’une cliente enregistrera son panier.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.uuid} className="group text-sm transition hover:bg-[#faf8f5]">
                    <td className="px-4 py-4">
                      <Link href={`/admin/orders/${encodeURIComponent(order.id)}`} className="font-semibold text-[#5d241f] underline-offset-4 group-hover:underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <p className="font-medium">{order.customer}</p>
                      <p className="mt-1 text-[0.68rem] text-[#92857a]">{order.email}</p>
                    </td>
                    <td className="px-4 py-4">{order.items}</td>
                    <td className="px-4 py-4 text-[#746960]">{order.country}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-semibold">{order.total.toLocaleString("fr-FR")} MAD</td>
                    <td className="px-4 py-4">
                      <StatusBadge>{order.payment}</StatusBadge>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge>{order.status}</StatusBadge>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-xs text-[#897d72]">{order.date}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <footer className="border-t border-[#ece7e2] bg-[#faf9f7] px-5 py-4 text-xs text-[#82766c]">
          {orders.length} commande{orders.length === 1 ? "" : "s"}
        </footer>
      </section>
    </div>
  );
}
