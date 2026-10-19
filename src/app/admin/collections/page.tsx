import { Layers3 } from "lucide-react";

import { updateCollection } from "@/app/admin/collections/actions";
import { PageHeader, StatusBadge } from "@/components/dashboard/AdminUI";
import { SubmitButton } from "@/components/dashboard/SubmitButton";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { supabaseConfigState } from "@/lib/supabase/config";

export default async function CollectionsPage() {
  const client = createAdminClient() ?? (supabaseConfigState.publicReady ? await createClient() : null);
  const { data: collectionRows, error } = client ? await client.from("collections").select("id,slug,name,description,status,color").order("name") : { data: [], error: null };
  if (error) throw new Error(`Lecture des collections impossible: ${error.message}`);
  const data = collectionRows ?? [];
  return <div className="space-y-8"><PageHeader eyebrow="Catalogue · 03" title="Collections" description="Organisez les familles de produits et leur publication dans la boutique." /><div className="grid gap-5 lg:grid-cols-2">{data.map((collection) => <form action={updateCollection.bind(null, collection.id)} key={collection.id} className="rounded-2xl border border-[#e5e0db] bg-white p-5 shadow-[0_8px_24px_rgba(44,32,24,0.035)]"><div className="flex items-start justify-between gap-4"><span className="flex size-11 items-center justify-center rounded-xl" style={{ backgroundColor: `${collection.color ?? "#5d241f"}18`, color: collection.color ?? "#5d241f" }}><Layers3 className="size-5" /></span><StatusBadge>{collection.status === "live" ? "En ligne" : collection.status}</StatusBadge></div><div className="mt-5 grid gap-4 sm:grid-cols-[1fr_8rem]"><label className="text-xs text-[#81756b]">Nom<input name="name" defaultValue={collection.name} required className="mt-2 h-11 w-full rounded-lg border border-[#ddd8d2] px-3 text-sm outline-none focus:border-[#9a786b]" /></label><label className="text-xs text-[#81756b]">Couleur<input name="color" defaultValue={collection.color ?? "#5d241f"} type="color" className="mt-2 h-11 w-full rounded-lg border border-[#ddd8d2] bg-white p-1" /></label></div><label className="mt-4 block text-xs text-[#81756b]">Description<textarea name="description" defaultValue={collection.description ?? ""} className="mt-2 min-h-24 w-full rounded-lg border border-[#ddd8d2] p-3 text-sm outline-none focus:border-[#9a786b]" /></label><div className="mt-4 flex items-end gap-3"><label className="flex-1 text-xs text-[#81756b]">Publication<select name="status" defaultValue={collection.status} className="mt-2 h-11 w-full rounded-lg border border-[#ddd8d2] bg-white px-3 text-sm"><option value="draft">Brouillon</option><option value="live">En ligne</option><option value="archived">Archivée</option></select></label><SubmitButton>Enregistrer</SubmitButton></div><p className="mt-4 text-[0.68rem] text-[#9a8e84]">/{collection.slug}</p></form>)}</div></div>;
}
