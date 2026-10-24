/* Isolated regression checks: no network, no database writes. */
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const assert = require('node:assert/strict');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, parent, ...args) {
  return originalResolve.call(this, request.startsWith('@/') ? path.join(root, 'src', request.slice(2)) : request, parent, ...args);
};
for (const extension of ['.ts', '.tsx']) Module._extensions[extension] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText, filename);
let authorized = true, rows = [], invalidations = [], products = [];
const client = { from(table) {
  const chain = {
    select() { return chain; }, eq() { return chain; }, order() { return chain; }, like() { return chain; },
    single() { return Promise.resolve({ data: { metadata: products[0]?.metadata ?? {}, sku: products[0]?.sku }, error: null }); },
    then(resolve) { return Promise.resolve({ data: table === 'products' ? products : rows, error: null }).then(resolve); },
    async upsert(next) { rows = next; return { error: null }; },
  };
  // Supabase update returns a query builder, not a Promise.
  chain.update = next => { products = [{ ...products[0], ...next }]; return { eq: async () => ({ error: null }) }; };
  return chain;
} };
const originalLoad = Module._load;
Module._load = function (request, ...args) {
  if (request === 'server-only') return {};
  if (request === 'next/cache') return { unstable_cache: fn => fn, updateTag: tag => invalidations.push(tag), revalidatePath: (...args) => invalidations.push(args) };
  if (request === 'next/navigation') return { redirect: url => { throw Object.assign(new Error(url), { digest: 'NEXT_REDIRECT' }); } };
  if (request === '@/lib/admin-access') return { requireLocalAdminClient: async () => { if (!authorized) throw new Error('Access denied'); return client; } };
  if (request === '@/lib/admin-product-image') return { resolveProductImageUrl: async () => '/managed-product.png' };
  if (request === '@supabase/supabase-js') return { createClient: () => client };
  if (request === '@/lib/supabase/config') return { supabaseConfigState: { publicReady: true }, getPublicSupabaseConfig: () => ({ url: 'http://fixture.invalid', publishableKey: 'fixture' }) };
  return originalLoad.call(this, request, ...args);
};
async function main() {
  const model = require('../src/lib/content-model.ts');
  const { fields } = require('../src/lib/content-fields.ts');
  const { saveContent } = require('../src/app/admin/content/actions.ts');
  for (const key of Object.keys(model.contentSources)) {
    const form = new FormData();
    for (const locale of ['fr', 'en', 'ar']) for (const field of fields(model.contentDefault(key, locale))) form.set(`${locale}:${field.path}`, field.value);
    form.set('reviewed', 'on');
    if (key === 'home') form.set('fr:hero.body', 'Texte modifié depuis le dashboard');
    const result = await saveContent(key, null, form);
    assert(result.success, result.error);
    assert.equal(rows.length, 3);
    assert.deepEqual(rows.map(row => row.locale), ['fr', 'en', 'ar']);
    assert(rows.every(row => row.status === 'published'));
    if (key === 'home') assert.equal(rows[0].body.hero.body, 'Texte modifié depuis le dashboard');
  }
  assert(invalidations.includes('storefront-content'));
  assert(invalidations.some(item => Array.isArray(item) && item[0] === '/[locale]' && item[1] === 'layout'));
  assert(fields(model.contentDefault('dictionary', 'fr')).some(field => field.path.startsWith('product.')));
  authorized = false;
  assert((await saveContent('home', null, new FormData())).error);
  authorized = true;
  assert((await saveContent('home', null, new FormData())).error);
  const { catalogProducts } = require('../src/lib/catalog.ts');
  const base = catalogProducts[0];
  products = [{ id: 'fixture-id', sku: base.sku, slug: base.slug, name: 'Nom édité', description: 'Description FR éditée', price_eur: 12, stock_quantity: 5, status: 'active', image_url: '/managed-product.png', metadata: { localized: { name: { en: 'Edited name', ar: 'اسم معدل' }, description: { en: 'Edited description', ar: 'وصف معدل' }, howToUse: { fr: 'Mode édité', en: 'Edited directions', ar: 'طريقة الاستعمال' }, ritualNote: { fr: 'Rituel édité', en: '', ar: '' } } } }];
  const { getStorefrontProducts } = require('../src/lib/storefront-catalog.ts');
  const [edited] = await getStorefrontProducts();
  assert.equal(edited.name.fr, 'Nom édité'); assert.equal(edited.name.en, 'Edited name');
  assert.equal(edited.description.fr, 'Description FR éditée'); assert.equal(edited.description.ar, 'وصف معدل');
  assert.equal(edited.howToUse.en, 'Edited directions'); assert.equal(edited.ritualNote.en, '');
  assert.equal(edited.image, '/managed-product.png'); assert.equal(edited.priceEUR, 12);
  const { updateProduct, saveProductTexts } = require('../src/app/admin/products/actions.ts');
  const productForm = new FormData();
  for (const [key, value] of Object.entries({ name: 'Nouveau nom', description: 'Nouvelle description', sku: base.sku, slug: base.slug, product_type: 'body-oil', fragrance: 'fleur-doranger', status: 'active', price_eur: '13', translations_reviewed: 'on' })) productForm.set(key, value);
  for (const locale of ['fr', 'en', 'ar']) for (const key of ['name', 'tagline', 'description', 'ritualNote', 'howToUse', 'vessel']) productForm.set(`localized:${key}:${locale}`, `${key} ${locale}`);
  await assert.rejects(() => updateProduct('fixture-id', null, productForm), error => error.digest === 'NEXT_REDIRECT');
  assert.equal(products[0].metadata.localized.description.ar, 'وصف معدل');
  assert.equal(products[0].name, 'Nom édité');
  const beforeTextPrice = products[0].price_eur;
  assert((await saveProductTexts('fixture-id', null, productForm)).success);
  assert.equal(products[0].price_eur, beforeTextPrice);
  assert.equal(products[0].metadata.localized.description.ar, 'description ar');
  assert.equal(products[0].metadata.localized.description.fr, 'Nouvelle description');
  assert.equal(products[0].metadata.localized.howToUse.en, 'howToUse en');
  assert(invalidations.includes('storefront-catalog'));
  productForm.delete('translations_reviewed');
  assert((await saveProductTexts('fixture-id', null, productForm)).error);
  const savedCopy = JSON.stringify(products[0].metadata.localized);
  for (const slug of ['conditioner-the-vert', 'conditioner-safran']) {
    productForm.set('slug', slug); productForm.set('price_eur', '15.50');
    for (const key of [...productForm.keys()]) if (key.startsWith('localized:')) productForm.delete(key);
    await assert.rejects(() => updateProduct('fixture-id', null, productForm), error => error.digest === 'NEXT_REDIRECT');
    assert.equal(products[0].price_eur, 15.5);
    assert.equal(JSON.stringify(products[0].metadata.localized), savedCopy);
  }
  const form = new FormData();
  for (const locale of ['fr', 'en', 'ar']) for (const field of fields(model.contentDefault('editorial', locale))) form.set(`${locale}:${field.path}`, field.value);
  form.set('reviewed', 'on'); form.set('ar:rituals.4.title', 'مجموعة منزلية معدلة');
  assert((await saveContent('editorial', null, form)).success);
  const { getStorefrontEditorial } = require('../src/lib/storefront-content.ts');
  assert.equal((await getStorefrontEditorial('ar')).rituals[4].title.ar, 'مجموعة منزلية معدلة');
  assert.equal(model.merge({ title: 'Safe' }, { title: 123, injected: 'No' }).title, 'Safe');
  console.log('PASS: all content sections round-trip in FR/EN/AR; authorization, review gate, invalidation, safe merge, managed product copy/image/price and Arabic collection edits. No network or database writes.');
}
main().catch(error => { console.error(error); process.exitCode = 1; });
