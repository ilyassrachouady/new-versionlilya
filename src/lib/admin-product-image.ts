import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";

const BUCKET = "product-images";
const MAX_BYTES = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

function extension(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase();
  if (fromName && /^[a-z0-9]{2,5}$/.test(fromName)) return fromName;
  return file.type.replace("image/", "").replace("jpeg", "jpg") || "jpg";
}

async function ensureBucket(client: SupabaseClient<Database>) {
  const { data: buckets, error } = await client.storage.listBuckets();
  if (error) throw new Error(`Images indisponibles: ${error.message}`);
  if (buckets?.some((bucket) => bucket.name === BUCKET || bucket.id === BUCKET)) return;

  const { error: createError } = await client.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: MAX_BYTES.toString(),
    allowedMimeTypes: [...ALLOWED],
  });
  if (createError && !/already exists/i.test(createError.message)) {
    throw new Error(`Impossible de préparer le dossier d’images: ${createError.message}`);
  }
}

export async function resolveProductImageUrl(client: SupabaseClient<Database>, formData: FormData, sku: string) {
  const file = formData.get("image_file");
  const pasted = String(formData.get("image_url") ?? "").trim();

  if (file instanceof File && file.size > 0) {
    if (file.size > MAX_BYTES) throw new Error("L’image ne doit pas dépasser 8 Mo.");
    if (file.type && !ALLOWED.has(file.type)) throw new Error("Utilisez une image JPG, PNG, WEBP, AVIF ou GIF.");

    await ensureBucket(client);
    const path = `${slugPath(sku)}/${crypto.randomUUID()}.${extension(file)}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const { error } = await client.storage.from(BUCKET).upload(path, buffer, {
      contentType: file.type || "image/jpeg",
      upsert: false,
    });
    if (error) throw new Error(`Téléversement impossible: ${error.message}`);
    return client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
  }

  return pasted || null;
}

function slugPath(sku: string) {
  return sku.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "produit";
}
