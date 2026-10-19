insert into public.collections (slug, name, description, status, color)
values
  ('fleur-d-oranger', 'Fleur d’Oranger', 'Une collection lumineuse inspirée des vergers marocains.', 'live', '#67231f'),
  ('the-vert', 'Thé Vert', 'Une fraîcheur végétale et précise.', 'live', '#263c2d'),
  ('safran', 'Safran', 'Une chaleur dorée aux accents épicés.', 'live', '#b16a26'),
  ('ambre-musc', 'Ambre Musc', 'Une signature enveloppante et profonde.', 'live', '#392823')
on conflict (slug) do update set name = excluded.name, description = excluded.description, status = excluded.status, color = excluded.color;

insert into public.products (sku, slug, name, description, price_mad, stock_quantity, low_stock_threshold, status, image_url)
values
  ('MLZ-BO-100', 'huile-corporelle-fleur-d-oranger', 'Huile corporelle', 'Huile sensorielle à la fleur d’oranger.', 150, 8, 10, 'active', '/products/fleur-doranger/body-oil/shop/02-clean-product.png'),
  ('MLZ-BS-250', 'gommage-corporel-fleur-d-oranger', 'Gommage corporel', 'Gommage corporel enrichi en huile d’argan.', 150, 31, 10, 'active', '/products/fleur-doranger/body-scrub/shop/02-clean-product.png'),
  ('MLZ-HM-200', 'masque-capillaire-fleur-d-oranger', 'Masque capillaire', 'Masque nourrissant pour les cheveux.', 140, 24, 10, 'active', '/products/fleur-doranger/hair-mask/shop/02-clean-product.png'),
  ('MLZ-HP-100', 'parfum-cheveux-fleur-d-oranger', 'Parfum pour cheveux', 'Brume parfumée à la fleur d’oranger.', 340, 17, 10, 'active', '/products/fleur-doranger/hair-perfume/shop/02-clean-product.png'),
  ('MLZ-STV-200', 'shampooing-the-vert', 'Shampooing', 'Shampooing doux au thé vert.', 110, 42, 10, 'active', '/products/the-vert/shampoo/shop/02-clean-product.png'),
  ('MLZ-BMAM-200', 'lait-corporel-ambre-musc', 'Lait corporel', 'Lait corporel nourrissant Ambre Musc.', 130, 0, 10, 'active', '/products/ambre-musc/body-milk/shop/02-clean-product.png')
on conflict (sku) do update set name = excluded.name, description = excluded.description, price_mad = excluded.price_mad, stock_quantity = excluded.stock_quantity, status = excluded.status, image_url = excluded.image_url;

insert into public.collection_products (collection_id, product_id, position)
select c.id, p.id, row_number() over (partition by c.id order by p.sku)::integer
from public.products p
join public.collections c on
  (p.slug like '%fleur-d-oranger%' and c.slug = 'fleur-d-oranger') or
  (p.slug like '%the-vert%' and c.slug = 'the-vert') or
  (p.slug like '%ambre-musc%' and c.slug = 'ambre-musc')
on conflict (collection_id, product_id) do update set position = excluded.position;
