"use server";

import { revalidatePath } from "next/cache";

import { requireLocalAdminClient } from "@/lib/admin-access";

export async function updateCollection(id: string, formData: FormData) {
  const client = await requireLocalAdminClient();
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const color = String(formData.get("color") ?? "").trim();
  const status = String(formData.get("status") ?? "draft");
  if (!name || !["draft", "live", "archived"].includes(status)) throw new Error("Données de collection invalides.");
  const { error } = await client.from("collections").update({ name, description: description || null, color: color || null, status }).eq("id", id);
  if (error) throw new Error(`Enregistrement impossible: ${error.message}`);
  revalidatePath("/admin/collections");
  revalidatePath("/admin/database");
}
