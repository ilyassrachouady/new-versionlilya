export type OrderStatus = "En préparation" | "Traitée" | "Expédiée" | "Livrée" | "Remboursée";

export const adminOrders = [
  { id: "MLZ-1048", customer: "Salma Bennani", email: "salma.b@example.com", items: 3, country: "Maroc", total: 69.12, payment: "Payée", status: "En préparation" as OrderStatus, date: "11 oct. · 14:32" },
  { id: "MLZ-1047", customer: "Leïla Haddad", email: "leila.h@example.com", items: 2, country: "France", total: 44.56, payment: "Payée", status: "Traitée" as OrderStatus, date: "11 oct. · 12:18" },
  { id: "MLZ-1046", customer: "Noor Al Mansouri", email: "noor.a@example.com", items: 4, country: "Émirats arabes unis", total: 101.86, payment: "Payée", status: "Expédiée" as OrderStatus, date: "11 oct. · 10:41" },
  { id: "MLZ-1045", customer: "Emma Laurent", email: "emma.l@example.com", items: 1, country: "Belgique", total: 30.92, payment: "Payée", status: "Livrée" as OrderStatus, date: "10 oct. · 18:06" },
  { id: "MLZ-1044", customer: "Meryem El Idrissi", email: "meryem.e@example.com", items: 2, country: "Maroc", total: 25.47, payment: "Remboursée", status: "Remboursée" as OrderStatus, date: "10 oct. · 16:22" },
  { id: "MLZ-1043", customer: "Sofia Rossi", email: "sofia.r@example.com", items: 3, country: "Italie", total: 55.48, payment: "Payée", status: "Livrée" as OrderStatus, date: "10 oct. · 11:04" },
];

const fragranceCodes = { "fleur-doranger": "FO", "the-vert": "TV", "ambre-musc": "AM", safran: "SF", "fleur-orientale": "OR" } as const;
const productCodes = { shampoo: "SH", conditioner: "CO", "hair-mask": "HM", "body-scrub": "BS", "body-oil": "BO", "body-milk": "BM", "hair-perfume": "HP", "shower-gel": "SG", "face-scrub": "FS", "rose-water": "RW" } as const;

export const adminObjects = catalogProducts.map((product, index) => ({
  no: String(index + 1).padStart(2, "0"),
  name: product.name.fr,
  collection: fragrances[product.fragrance],
  price: product.priceEUR,
  inventory: 25,
  status: "Actif",
  image: shopProductImages[product.slug] ?? product.image,
  sku: product.sku ?? `MLZ-${fragranceCodes[product.fragrance]}-${productCodes[product.productType]}-${product.volumeMl}`,
}));

export const adminCustomers = [
  { name: "Salma Bennani", email: "salma.b@example.com", country: "Maroc", orders: 6, value: 349.24, last: "Aujourd’hui", segment: "VIP" },
  { name: "Leïla Haddad", email: "leila.h@example.com", country: "France", orders: 3, value: 155.52, last: "Aujourd’hui", segment: "Fidèle" },
  { name: "Noor Al Mansouri", email: "noor.a@example.com", country: "Émirats arabes unis", orders: 2, value: 178.26, last: "Aujourd’hui", segment: "Forte valeur" },
  { name: "Emma Laurent", email: "emma.l@example.com", country: "Belgique", orders: 1, value: 30.92, last: "Hier", segment: "Première commande" },
  { name: "Meryem El Idrissi", email: "meryem.e@example.com", country: "Maroc", orders: 4, value: 135.51, last: "Hier", segment: "Fidèle" },
];

export const revenuePoints = [42, 58, 52, 76, 64, 91, 84, 112, 105, 138, 124, 156, 148, 182];
export const previousRevenuePoints = [38, 44, 49, 55, 59, 68, 73, 79, 86, 94, 101, 109, 116, 124];

export const collections = [
  { name: "Fleur d’Oranger", objects: 7, revenue: "1347.85 EUR", status: "En ligne", tone: "#67231f" },
  { name: "Thé Vert", objects: 6, revenue: "540.23 EUR", status: "En ligne", tone: "#263c2d" },
  { name: "Safran", objects: 6, revenue: "251.93 EUR", status: "En ligne", tone: "#b16a26" },
  { name: "Ambre Musc", objects: 6, revenue: "120.05 EUR", status: "En ligne", tone: "#392823" },
];
import { catalogProducts, fragrances } from "@/lib/catalog";
import { shopProductImages } from "@/lib/shop-product-images";
