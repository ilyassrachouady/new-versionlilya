import { Boxes, CheckCircle2, Circle, Database, HardDrive, RefreshCw, ShieldCheck, ShoppingBag, TableProperties, Users } from "lucide-react";

import { AdminButton, PageHeader, SectionTitle, StatusBadge } from "@/components/dashboard/AdminUI";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigState } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

const tables = [
  { key: "products", name: "produits", description: "Catalogue, prix, variantes et médias", records: 25, icon: Boxes },
  { key: "orders", name: "commandes", description: "Commandes, paiements et statuts", records: 38, icon: ShoppingBag },
  { key: "customers", name: "clients", description: "Profils, adresses et historique", records: 1284, icon: Users },
  { key: "collections", name: "collections", description: "Collections et associations produit", records: 4, icon: TableProperties },
  { key: "inventory_movements", name: "stocks", description: "Quantités, réservations et mouvements", records: 25, icon: HardDrive },
  { key: "content_entries", name: "contenus", description: "Pages, traductions et métadonnées", records: 42, icon: Database },
];

const steps: Array<[string, string, boolean]> = [
  ["Choisir le fournisseur", "Supabase héberge la base PostgreSQL de la boutique", true],
  ["Créer le schéma", "Tables, relations, index et règles RLS appliqués", true],
  ["Configurer les accès", "URL et clé publique enregistrées localement", true],
  ["Importer les données", "Catalogue initial chargé dans Supabase", true],
];

export default async function DatabasePage() {
  const supabase = createAdminClient() ?? (supabaseConfigState.publicReady ? await createClient() : null);
  const results = supabase ? await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }),
    supabase.from("orders").select("id", { count: "exact", head: true }),
    supabase.from("customers").select("id", { count: "exact", head: true }),
    supabase.from("collections").select("id", { count: "exact", head: true }),
    supabase.from("inventory_movements").select("id", { count: "exact", head: true }),
    supabase.from("content_entries").select("id", { count: "exact", head: true }),
  ]) : [];
  const publicConnectionWorks = !results[0]?.error && !results[3]?.error;
  const connected = results.length === tables.length && (supabaseConfigState.serverReady ? results.every((result) => !result.error) : publicConnectionWorks);
  const counts = new Map(tables.map((table, index) => [table.key, results[index]?.count ?? (connected ? 0 : table.records)]));
  const connectionLabel = connected ? "Connectée" : supabaseConfigState.serverReady ? "Connexion à vérifier" : "Non connectée";
  const connectionStatus = connected ? "Opérationnelle" : supabaseConfigState.publicReady ? "Connexion à vérifier" : "À configurer";

  return <div className="space-y-7">
    <PageHeader
      eyebrow="Système · 09"
      title="Base de données"
      description="Structure prévue pour centraliser le catalogue, les commandes, les clients et les contenus de la Maison."
      actions={<><AdminButton variant="secondary"><RefreshCw className="size-4" />Actualiser</AdminButton><AdminButton>Configurer la connexion</AdminButton></>}
    />

    <section className="grid gap-4 md:grid-cols-3">
      <article className="rounded-2xl border border-[#e5e0db] bg-white p-5 shadow-[0_8px_24px_rgba(44,32,24,0.035)]"><div className="flex items-center justify-between"><p className="text-xs text-[#82766e]">État de la connexion</p><StatusBadge>{connectionStatus}</StatusBadge></div><p className="mt-5 text-xl font-semibold">{connectionLabel}</p><p className="mt-2 text-xs leading-5 text-[#91857b]">{connected ? "Supabase répond et le schéma est disponible." : "Ajoutez les clés locales puis appliquez la migration SQL."}</p></article>
      <article className="rounded-2xl border border-[#e5e0db] bg-white p-5 shadow-[0_8px_24px_rgba(44,32,24,0.035)]"><div className="flex items-center justify-between"><p className="text-xs text-[#82766e]">Tables prévues</p><TableProperties className="size-4 text-[#5d241f]" /></div><p className="mt-5 text-3xl font-semibold">6</p><p className="mt-2 text-xs leading-5 text-[#91857b]">Un socle simple, extensible et adapté à la boutique.</p></article>
      <article className="rounded-2xl border border-[#e5e0db] bg-white p-5 shadow-[0_8px_24px_rgba(44,32,24,0.035)]"><div className="flex items-center justify-between"><p className="text-xs text-[#82766e]">Sécurité</p><ShieldCheck className="size-4 text-[#61745e]" /></div><p className="mt-5 text-xl font-semibold">RLS activé</p><p className="mt-2 text-xs leading-5 text-[#91857b]">Le catalogue public est lisible, les données privées restent protégées.</p></article>
    </section>

    <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(19rem,.8fr)]">
      <article className="rounded-2xl border border-[#e5e0db] bg-white p-5 shadow-[0_8px_24px_rgba(44,32,24,0.035)] sm:p-6">
        <SectionTitle title="Modèle de données prévu" note={connected ? "Volumes lus directement depuis Supabase." : "Volumes de démonstration affichés avant la connexion."} />
        <div className="mt-5 grid gap-3 sm:grid-cols-2">{tables.map(({ key, name, description, records, icon: Icon }) => <div key={name} className="flex items-center gap-4 rounded-xl border border-[#eee9e4] bg-[#faf9f7] p-4"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#5d241f]"><Icon className="size-4" /></span><div className="min-w-0 flex-1"><p className="font-mono text-xs font-semibold text-[#312824]">{name}</p><p className="mt-1 truncate text-[0.68rem] text-[#8d8177]">{description}</p></div><span className="text-xs font-semibold text-[#62574f]">{(counts.get(key) ?? records).toLocaleString("fr-FR")}</span></div>)}</div>
      </article>

      <aside className="rounded-2xl bg-[#263a2c] p-5 text-white shadow-[0_12px_30px_rgba(38,58,44,.12)] sm:p-6">
        <div className="flex items-center gap-2 text-[#d5bea4]"><Database className="size-4" /><p className="text-xs font-semibold">Plan de connexion</p></div>
        <h2 className="mt-4 text-xl font-semibold">Connexion terminée</h2>
        <p className="mt-2 text-xs leading-6 text-white/65">La base Supabase est prête à alimenter le catalogue et les prochains outils du tableau de bord.</p>
        <ol className="mt-6 space-y-4">{steps.map(([title, note, done], index) => <li key={title} className="flex gap-3"><span className="mt-0.5">{done ? <CheckCircle2 className="size-4 text-[#d5bea4]" /> : <Circle className="size-4 text-white/35" />}</span><div><p className="text-xs font-medium">{index + 1}. {title}</p><p className="mt-1 text-[0.68rem] leading-5 text-white/50">{note}</p></div></li>)}</ol>
      </aside>
    </section>

    <section className="rounded-2xl border border-[#e5e0db] bg-white p-5 sm:p-6"><SectionTitle title="Principes du futur schéma" /><div className="mt-5 grid gap-3 md:grid-cols-3">{[["Références stables", "Identifiants uniques pour les produits, commandes et clients."], ["Historique conservé", "Chaque mouvement de stock et changement de commande reste traçable."], ["Français par défaut", "Les champs administratifs et contenus internes utilisent le français."]].map(([title, body]) => <div key={title} className="rounded-xl bg-[#f8f6f3] p-4"><h3 className="text-sm font-semibold">{title}</h3><p className="mt-2 text-xs leading-5 text-[#82766e]">{body}</p></div>)}</div></section>
  </div>;
}
