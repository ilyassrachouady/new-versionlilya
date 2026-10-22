import { UserRound } from "lucide-react";

import { MetricCard, PageHeader, StatusBadge } from "@/components/dashboard/AdminUI";
import { getAdminCustomers } from "@/lib/admin-commerce";
import { formatMoney } from "@/lib/currency";

export default async function CustomersPage() {
  const customers = await getAdminCustomers();
  const totalValue = customers.reduce((sum, customer) => sum + customer.value, 0);
  const withOrders = customers.filter((customer) => customer.orders > 0).length;

  return (
    <div className="space-y-9">
      <PageHeader eyebrow="Clients · 04" title="Clients" description="Clients enregistrés à la commande, avec l’historique réel des paniers." />
      <section className="grid grid-cols-2 gap-x-5 lg:grid-cols-4 lg:gap-x-8">
        <MetricCard label="Total des clients" value={String(customers.length)} />
        <MetricCard label="Avec commande" value={String(withOrders)} />
        <MetricCard label="Valeur cumulée" value={formatMoney(totalValue)} />
        <MetricCard label="Dernier ajout" value={customers[0]?.last ?? "—"} />
      </section>
      <div className="overflow-x-auto border-t border-[#cfc4b4]">
        <table className="w-full min-w-[55rem]">
          <thead>
            <tr className="admin-label text-[#8d8075]">
              {["Client", "Pays", "Commandes", "Valeur client", "Dernière commande", "Segment"].map((title) => (
                <th key={title} className="py-4 pe-5 text-start font-medium">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#dcd3c7]">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-10 text-sm text-[#82766c]">
                  Aucun client pour le moment.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.email} className="text-sm hover:bg-[#f9f5ee]">
                  <td className="py-4 pe-5">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center bg-[#e5ddd1]">
                        <UserRound className="size-4" />
                      </span>
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="mt-1 text-[0.68rem] text-[#92857a]">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pe-5 text-[#746960]">{customer.country}</td>
                  <td className="py-4 pe-5">{customer.orders}</td>
                  <td className="py-4 pe-5 admin-serif text-lg">{formatMoney(customer.value)}</td>
                  <td className="py-4 pe-5 text-[#746960]">{customer.last}</td>
                  <td className="py-4">
                    <StatusBadge>{customer.segment}</StatusBadge>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
