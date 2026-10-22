"use client";

import { useActionState, useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Link2, Save, Upload } from "lucide-react";

import { AdminMedia, SectionTitle } from "@/components/dashboard/AdminUI";
import { SubmitButton } from "@/components/dashboard/SubmitButton";
import type { ProductFormState } from "@/app/admin/products/actions";
import {
  fragranceOptions,
  metadataValue,
  parseFragrance,
  parseProductType,
  productTypeOptions,
  suggestSku,
  suggestSlug,
} from "@/lib/admin-product-form";
import type { AdminProduct } from "@/lib/admin-products";
import { cn } from "@/lib/utils";
import { rituals } from "@/lib/content";
import type { RitualId } from "@/lib/catalog";

const field =
  "mt-2 h-11 w-full rounded-lg border border-[#d5cabc] bg-white px-3 text-sm text-[#332a25] outline-none focus:border-[#6e5d4c]";

function Choice({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-[0.72rem] transition",
        selected
          ? "border-[#173326] bg-[#173326] font-medium text-[#f3e3d0]"
          : "border-[#d5cabc] bg-white text-[#5c534c] hover:border-[#aa8a61]",
      )}
    >
      {children}
    </button>
  );
}

export function ProductForm({
  product,
  action,
  archiveAction,
}: {
  product?: AdminProduct | null;
  action: (state: ProductFormState, formData: FormData) => Promise<ProductFormState>;
  archiveAction?: () => void | Promise<void>;
}) {
  const existing = Boolean(product);
  const initialType = parseProductType(metadataValue(product?.metadata, "productType") || product?.name || "");
  const initialFragrance = parseFragrance(
    metadataValue(product?.metadata, "fragrance") || metadataValue(product?.metadata, "scent") || product?.name || "",
  );
  const initialVolume =
    (metadataValue(product?.metadata, "volumeMl") !== "" ? Number(metadataValue(product?.metadata, "volumeMl")) : undefined) ??
    productTypeOptions.find((option) => option.id === initialType)?.volume ??
    200;

  const [state, formAction] = useActionState(action, null);
  const [name, setName] = useState(product?.name ?? "");
  const [type, setType] = useState(initialType);
  const [ritual, setRitual] = useState(metadataValue(product?.metadata, "ritual"));
  const [fragrance, setFragrance] = useState(initialFragrance);
  const [volume, setVolume] = useState(initialVolume);
  const [price, setPrice] = useState(String(product?.price_eur ?? ""));
  const [stock, setStock] = useState(String(product?.stock_quantity ?? 10));
  const [status, setStatus] = useState(product?.status ?? "draft");
  const [description, setDescription] = useState(product?.description ?? "");
  const [sku, setSku] = useState(product?.sku ?? suggestSku(initialType, initialFragrance, initialVolume));
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [skuLocked, setSkuLocked] = useState(existing);
  const [slugLocked, setSlugLocked] = useState(existing);
  const [imageUrl, setImageUrl] = useState(product?.image_url ?? "");
  const [imageMode, setImageMode] = useState<"upload" | "url">(product?.image_url?.startsWith("http") ? "url" : "upload");
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const scentLabel = fragranceOptions.find((option) => option.id === fragrance)?.label ?? "";
  const typeLabel = productTypeOptions.find((option) => option.id === type)?.label ?? "";
  const preview = filePreview || imageUrl;

  const generatedSku = useMemo(() => suggestSku(type, fragrance, volume), [type, fragrance, volume]);
  const generatedSlug = useMemo(() => suggestSlug(name, type, fragrance), [name, type, fragrance]);

  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  function takeFile(file?: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (filePreview) URL.revokeObjectURL(filePreview);
    const url = URL.createObjectURL(file);
    setFilePreview(url);
    setFileName(file.name);
    setImageMode("upload");
    const transfer = new DataTransfer();
    transfer.items.add(file);
    if (fileRef.current) fileRef.current.files = transfer.files;
  }

  function clearImage() {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFilePreview(null);
    setFileName("");
    setImageUrl("");
    if (fileRef.current) fileRef.current.value = "";
  }

  return (
    <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_20.5rem]">
      <form action={formAction} className="space-y-6">
        {state?.error && (
          <p role="alert" className="rounded-xl border border-[#ead9d5] bg-[#fff7f4] px-4 py-3 text-sm text-[#8d5048]">
            {state.error}
          </p>
        )}

        <section className="rounded-2xl border border-[#e5e0db] bg-white p-6">
          <SectionTitle title="L’objet" note="Nom, famille et signature suffisent. La référence se rédige toute seule." />
          <div className="mt-6 space-y-5">
            <label className="block text-xs text-[#81756b]">
              Nom
              <input
                name="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                placeholder="Huile Corporelle"
                className={cn(field, "h-12 text-base")}
              />
            </label>

            <div>
              <p className="text-xs text-[#81756b]">Famille</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {productTypeOptions.map((option) => (
                  <Choice
                    key={option.id}
                    selected={type === option.id}
                    onClick={() => {
                      setType(option.id);
                      setVolume(option.volume);
                    }}
                  >
                    {option.label}
                  </Choice>
                ))}
              </div>
              <input type="hidden" name="product_type" value={type} />
            </div>

            <div>
              <p className="text-xs text-[#81756b]">Signature</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {fragranceOptions.map((option) => (
                  <Choice key={option.id} selected={fragrance === option.id} onClick={() => setFragrance(option.id)}>
                    {option.label}
                  </Choice>
                ))}
              </div>
              <input type="hidden" name="fragrance" value={fragrance} />
            </div>

            <label className="block text-xs text-[#81756b]">
              Rubrique
              <select name="ritual" value={ritual} onChange={(event) => setRitual(event.target.value as RitualId)} className={field}>
                <option value="">Automatique selon le type</option>
                {rituals.map((item) => <option key={item.id} value={item.id}>{item.title.fr}</option>)}
              </select>
            </label>

            <div className="grid gap-5 sm:grid-cols-3">
              <label className="text-xs text-[#81756b]">
                Contenance (ml)
                <input
                  name="volume_ml"
                  type="number"
                  min={0}
                  value={volume}
                  onChange={(event) => setVolume(Number(event.target.value) || 0)}
                  className={field}
                />
              </label>
              <label className="text-xs text-[#81756b]">
                Prix (EUR)
                <input
                  name="price_eur"
                  type="number"
                  min={0}
                  step="0.01"
                  required
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="13.64"
                  className={field}
                />
              </label>
              <label className="text-xs text-[#81756b]">
                Stock
                <input
                  name="stock_quantity"
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  className={field}
                />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#e5e0db] bg-white p-6">
          <SectionTitle title="Photo" note="Déposez un fichier, ou collez un lien. L’un ou l’autre suffit." />
          <div className="mt-5 flex gap-2">
            <Choice selected={imageMode === "upload"} onClick={() => setImageMode("upload")}>
              <span className="inline-flex items-center gap-1.5">
                <Upload className="size-3.5" />
                Téléverser
              </span>
            </Choice>
            <Choice selected={imageMode === "url"} onClick={() => setImageMode("url")}>
              <span className="inline-flex items-center gap-1.5">
                <Link2 className="size-3.5" />
                Lien
              </span>
            </Choice>
          </div>

          <input
            ref={fileRef}
            id="product-image-file"
            name="image_file"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
            className="sr-only"
            onChange={(event) => takeFile(event.target.files?.[0])}
          />

          {imageMode === "upload" ? (
            <label
              htmlFor="product-image-file"
              onPaste={(event) => takeFile(event.clipboardData.files[0])}
              onDragOver={(event) => {
                event.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(event) => {
                event.preventDefault();
                setDragging(false);
                takeFile(event.dataTransfer.files[0]);
              }}
              className={cn(
                "mt-4 flex min-h-44 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 text-center transition",
                dragging ? "border-[#173326] bg-[#f4efe7]" : "border-[#d5cabc] bg-[#fbf7f0]",
              )}
            >
              <ImagePlus className="size-7 text-[#9a7a50]" />
              <p className="mt-3 text-sm font-medium text-[#332a25]">Glissez une image ici</p>
              <p className="mt-1 text-xs text-[#81756b]">JPG, PNG, WEBP · 8 Mo max · ou cliquez pour parcourir</p>
              {fileName && <p className="mt-3 text-xs text-[#173326]">{fileName}</p>}
            </label>
          ) : (
            <label className="mt-4 block text-xs text-[#81756b]">
              URL de l’image
              <input
                value={imageUrl}
                onChange={(event) => {
                  setImageUrl(event.target.value);
                  if (filePreview) {
                    URL.revokeObjectURL(filePreview);
                    setFilePreview(null);
                    setFileName("");
                    if (fileRef.current) fileRef.current.value = "";
                  }
                }}
                placeholder="https://…"
                className={field}
              />
            </label>
          )}
          <input type="hidden" name="image_url" value={filePreview ? "" : imageUrl} />
          {preview && (
            <button type="button" onClick={clearImage} className="admin-label mt-3 text-[#8d5048]">
              Retirer l’image
            </button>
          )}
        </section>

        <section className="rounded-2xl border border-[#e5e0db] bg-white p-6">
          <SectionTitle title="En boutique" />
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-xs text-[#81756b]">Publication</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Choice selected={status === "draft"} onClick={() => setStatus("draft")}>
                  Brouillon
                </Choice>
                <Choice selected={status === "active"} onClick={() => setStatus("active")}>
                  En boutique
                </Choice>
                {existing && (
                  <Choice selected={status === "archived"} onClick={() => setStatus("archived")}>
                    Archivé
                  </Choice>
                )}
              </div>
              <input type="hidden" name="status" value={status} />
            </div>
            <label className="block text-xs text-[#81756b]">
              Description
              <textarea
                name="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Quelques lignes pour la fiche, si vous les avez."
                className="mt-2 min-h-28 w-full rounded-lg border border-[#d5cabc] bg-white p-3 text-sm outline-none focus:border-[#6e5d4c]"
              />
            </label>
          </div>
        </section>

        <details className="rounded-2xl border border-[#e5e0db] bg-white p-6">
          <summary className="cursor-pointer text-sm font-medium text-[#173326]">Références (SKU et URL)</summary>
          <p className="mt-2 text-xs text-[#81756b]">Générées depuis le nom et la famille. Modifiez seulement si besoin.</p>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-xs text-[#81756b]">
              SKU
              <input
                name="sku"
                value={skuLocked ? sku : generatedSku}
                onChange={(event) => {
                  setSkuLocked(true);
                  setSku(event.target.value);
                }}
                className={field}
              />
            </label>
            <label className="text-xs text-[#81756b]">
              Slug
              <input
                name="slug"
                value={slugLocked ? slug : generatedSlug}
                onChange={(event) => {
                  setSlugLocked(true);
                  setSlug(event.target.value);
                }}
                className={field}
              />
            </label>
          </div>
          <input type="hidden" name="low_stock_threshold" value={product?.low_stock_threshold ?? 10} />
        </details>

        <div className="flex justify-end">
          <SubmitButton pendingLabel={existing ? "Enregistrement…" : "Création…"}>
            <Save className="size-4" />
            {existing ? "Enregistrer" : "Créer le produit"}
          </SubmitButton>
        </div>
      </form>

      <aside className="space-y-5 xl:sticky xl:top-28 xl:self-start">
        <section className="rounded-2xl border border-[#e5e0db] bg-white p-5">
          <SectionTitle title="Aperçu" note="Comme une carte du catalogue." />
          <div className="mt-4 overflow-hidden rounded-xl border border-[#eee9e4]">
            <div className="relative aspect-[4/5] bg-[#e8dccb]">
              {preview ? (
                <AdminMedia src={preview} className="object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-xs text-[#8d8177]">
                  Ajoutez une photo pour voir l’objet.
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="text-[0.65rem] tracking-[0.12em] text-[#9a7a50] uppercase">
                {scentLabel}
                {volume ? ` · ${volume} ML` : ""}
              </p>
              <p className="admin-serif mt-1 text-xl leading-tight">{name || "Nouveau produit"}</p>
              <p className="mt-1 text-xs text-[#81756b]">{typeLabel}</p>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold">{price ? `${Number(price).toFixed(2)} EUR` : "—"}</span>
                <span className="text-xs text-[#71665d]">{stock || "0"} unités</span>
              </div>
            </div>
          </div>
        </section>
        {archiveAction && (
          <form action={archiveAction} className="rounded-2xl border border-[#ead9d5] bg-white p-5">
            <p className="text-sm font-semibold">Archiver ce produit</p>
            <p className="mt-2 text-xs leading-5 text-[#81756b]">
              Le produit disparaîtra de la boutique mais restera dans la base.
            </p>
            <SubmitButton danger className="mt-4 w-full">
              Archiver
            </SubmitButton>
          </form>
        )}
      </aside>
    </div>
  );
}
