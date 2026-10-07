import Image from "next/image";
import {QuietLink} from "@/components/ui/Button";
import {Reveal} from "@/components/ui/Reveal";
import {fragranceIds,resolveCollection} from "@/lib/collections";
import {href,type Locale} from "@/lib/i18n/config";
import type {Dictionary} from "@/lib/i18n/dictionaries";
export function ShopCollectionDiscovery({locale,dict}:{locale:Locale;dict:Dictionary}){
 const collections=fragranceIds.map(id=>resolveCollection(id,locale,dict)).filter(c=>c.products.length>0);
 if(!collections.length)return null;
 return <section className="relative overflow-hidden bg-forest py-14 text-cream sm:py-20"><div className="shell"><Reveal><p className="eyebrow text-brass-light">{dict.nav.collections}</p><h2 className="display-lg mt-5">{dict.shopPage.discover}</h2></Reveal><ul className="mt-10 grid gap-10">{collections.map(c=><li key={c.id} className="grid items-center gap-8 border-t border-cream/20 pt-8 sm:grid-cols-[0.6fr_1fr]"><div className="relative aspect-[4/3] max-h-64 overflow-hidden bg-forest-deep"><Image src={c.products[0].image} alt="" fill sizes="(max-width: 640px) 90vw, 35vw" className="object-contain p-6" /></div><div><h3 className="display-lg">{c.title}</h3><p className="mt-5 max-w-lg text-[0.95rem] leading-relaxed text-cream/75">{c.line}</p><div className="mt-6"><QuietLink tone="light" href={href('/collections/'+c.id,locale)}>{dict.common.discover}</QuietLink></div></div></li>)}</ul></div></section>;
}
