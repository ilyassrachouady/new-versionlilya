# Produits Maison

Six products prepared at a provisional **10 EUR each**, with **zero stock** until the owner sets availability. The storefront reads prices and stock from Supabase; no additional hardcoded storefront prices were introduced.

## Activation

Run `supabase/migrations/20261023000000_maison_collection.sql` manually in the Supabase SQL Editor after the EUR pricing migration. It inserts the six products and the `home` collection. Re-running it preserves existing dashboard changes. This SQL has not been executed by the agent.

Product image URLs are workspace public paths; deploy this release with the images before activating the new records. The collection is `/fr/collections/home` (also `/en/collections/home` and `/ar/collections/home`). The catalogue cache refreshes within approximately two minutes after SQL import. Use the dashboard to edit EUR prices, stock, publication, photos, and the new Rubrique field.

## Images

The supplied campaign image is preserved at `public/collections/campaigns/home.png`.

The collections overview uses `public/collections/campaigns/home-category-hq.png`, a separately reframed 3:2 edit. The original 1962×802 panorama lost roughly 39% of its width when covered into the 3:2 category slot, enlarging product details and clipping products. The dedicated category image avoids this crop; the wide original remains on the collection detail page.

Category correction prompt (built-in image editing): reframe the same campaign into a sharp high-resolution 3:2 photograph by extending the warm plaster scene above and below; preserve the five original products, order, exact packaging, colors, labels, tassels, plinths and warm lighting; keep all bottles and reeds inside the frame with breathing room; crisp product detail, no added text, watermark, or products.

Individual assets are in `public/products/maison/`:

- `diffuseur-fleur-orientale.png`
- `eau-maison-fleur-de-lin.png`
- `huile-bruler-serghina.png`
- `eau-de-rose-maison.png`
- `brule-parfum-ceramique.png`
- `eau-maison-fleur-de-rose.png`

Generated using the built-in image editing tool, one reference photo per asset. Common prompt: preserve the exact product identity, shape, materials, pattern, logo, original label text, cap, tassel and accessories; replace only the surrounding background and surface with a seamless warm light beige studio backdrop (#ead9c2), a soft natural shadow and upper-left studio lighting; portrait 4:5, centered full product, no cropping, plants, props, added typography or watermark. Diffuser variant: preserve all black reeds and golden tassel, straighten perspective and brighten product. Burner variant: preserve the speckled ceramic and lit tea candle while removing the surrounding room and plants.

The rose water remains labeled as skincare, not room fragrance. Burner oil remains labeled for diffusion only. No unverified composition or efficacy claims have been added.
