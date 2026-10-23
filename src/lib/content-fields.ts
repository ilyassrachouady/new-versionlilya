const structural = new Set(["id", "slug", "slugs", "product", "productSlugs", "texture", "hero", "heroAspect", "image", "background", "index", "latin", "logo", "logoClassName"]);
export function fields(value: unknown, path: string[] = []): { path: string; value: string }[] {
  if (typeof value === "string") return [{ path: path.join("."), value }];
  if (!value || typeof value !== "object") return [];
  return Object.entries(value).flatMap(([key, item]) => structural.has(key) && (typeof item === "string" || Array.isArray(item)) ? [] : fields(item, [...path, key]));
}
