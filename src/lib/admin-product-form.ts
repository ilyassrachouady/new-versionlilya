import { fragrances, type FragranceId, type ProductType } from "@/lib/catalog";

export const productTypeOptions: { id: ProductType; label: string; code: string; volume: number }[] = [
  { id: "shampoo", label: "Shampooing", code: "SH", volume: 200 },
  { id: "conditioner", label: "Après-shampooing", code: "CO", volume: 200 },
  { id: "hair-mask", label: "Masque capillaire", code: "HM", volume: 200 },
  { id: "body-oil", label: "Huile corporelle", code: "BO", volume: 100 },
  { id: "body-milk", label: "Lait corporel", code: "BM", volume: 200 },
  { id: "body-scrub", label: "Gommage", code: "BS", volume: 250 },
  { id: "shower-gel", label: "Gel douche", code: "SG", volume: 250 },
  { id: "hair-perfume", label: "Parfum cheveux", code: "HP", volume: 100 },
  { id: "face-scrub", label: "Gommage visage", code: "FS", volume: 150 },
  { id: "rose-water", label: "Eau de rose", code: "RW", volume: 200 },
  { id: "reed-diffuser", label: "Diffuseur", code: "RD", volume: 100 },
  { id: "home-fragrance", label: "Eau de Maison", code: "HF", volume: 100 },
  { id: "burner-oil", label: "Huile à brûler", code: "BU", volume: 50 },
  { id: "oil-burner", label: "Brûle-parfum en céramique", code: "OB", volume: 0 },
  { id: "soap", label: "Savon", code: "SO", volume: 100 },
  { id: "black-soap", label: "Savon noir", code: "NK", volume: 250 },
  { id: "shea-balm", label: "Velours de karité", code: "VK", volume: 80 },
  { id: "botanical-bath", label: "Bain botanique", code: "BB", volume: 200 },
];

export const fragranceOptions = (Object.entries(fragrances) as [FragranceId, string][]).map(([id, label]) => ({
  id,
  label,
  code: { "fleur-doranger": "FO", "the-vert": "TV", "ambre-musc": "AM", safran: "SF", "fleur-orientale": "OR", "fleur-de-lin": "FL", "fleur-de-rose": "FR", serghina: "SE", "sans-parfum": "SP", "aker-fassi": "AF", nila: "NI", botanique: "BT" }[id],
}));

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 72);
}

export function suggestSku(type: ProductType, fragrance: FragranceId, volume: number) {
  const typeCode = productTypeOptions.find((option) => option.id === type)?.code ?? "XX";
  const fragranceCode = fragranceOptions.find((option) => option.id === fragrance)?.code ?? "XX";
  return `MLZ-${fragranceCode}-${typeCode}-${volume || 0}`;
}

export function suggestSlug(name: string, type: ProductType, fragrance: FragranceId) {
  const fromName = slugify(name);
  if (fromName) return fromName;
  return slugify(`${type}-${fragrance}`);
}

export function metadataValue(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object" || !(key in metadata)) return "";
  const value = (metadata as Record<string, unknown>)[key];
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? String(value) : "";
}

export function parseProductType(value: string): ProductType {
  if (productTypeOptions.some((option) => option.id === value)) return value as ProductType;
  const text = value.toLowerCase();
  if (text.includes("shampoo")) return "shampoo";
  if (text.includes("condition") || text.includes("après")) return "conditioner";
  if (text.includes("mask") || text.includes("masque")) return "hair-mask";
  if (text.includes("perfume") || text.includes("parfum")) return "hair-perfume";
  if (text.includes("oil") || text.includes("huile")) return "body-oil";
  if (text.includes("milk") || text.includes("lait")) return "body-milk";
  if (text.includes("shower") || text.includes("douche")) return "shower-gel";
  if (text.includes("face") && (text.includes("scrub") || text.includes("gommage"))) return "face-scrub";
  if (text.includes("savon noir") || text.includes("black soap") || text.includes("black-soap")) return "black-soap";
  if (text.includes("savon") || text.includes("soap")) return "soap";
  if (text.includes("velours") || text.includes("karité") || text.includes("karite")) return "shea-balm";
  if (text.includes("bain") || text.includes("botanical")) return "botanical-bath";
  if (text.includes("rose")) return "rose-water";
  if (text.includes("scrub") || text.includes("gommage")) return "body-scrub";
  return "body-milk";
}

export function parseFragrance(value: string): FragranceId {
  if (fragranceOptions.some((option) => option.id === value)) return value as FragranceId;
  const text = value.toLowerCase();
  const match = fragranceOptions.find((option) => text.includes(option.id) || text.includes(option.label.toLowerCase()));
  if (match) return match.id;
  if (text.includes("aker")) return "aker-fassi";
  if (text.includes("nila")) return "nila";
  if (text.includes("botanique")) return "botanique";
  if (text.includes("thé") || text.includes("the vert") || text.includes("green")) return "the-vert";
  if (text.includes("ambre")) return "ambre-musc";
  if (text.includes("safran")) return "safran";
  return "fleur-doranger";
}
