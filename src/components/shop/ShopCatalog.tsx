"use client";
import {useState} from "react";
import {ShopProductCard} from "@/components/shop/ShopProductCard";
import type {Product,RitualId} from "@/lib/catalog";
import {rituals} from "@/lib/content";
import type {Locale} from "@/lib/i18n/config";
import type {Dictionary} from "@/lib/i18n/dictionaries";
import {cn} from "@/lib/utils";
const PAGE_SIZE=16;
export function ShopCatalog({products,locale,dict}:{products:Product[];locale:Locale;dict:Dictionary}){
 const [ritual,setRitual]=useState<RitualId|"all">("all");
 const [page,setPage]=useState(1);
 const shown=products.filter(p=>ritual==="all"||p.ritual===ritual);
 const pages=Math.max(1,Math.ceil(shown.length/PAGE_SIZE));
 const activePage=Math.min(page,pages);
 const changePage=(next:number)=>{setPage(next);document.getElementById("shop-products")?.scrollIntoView({block:"start"});};
 return <section className="relative bg-[#efe4d7] py-10 sm:py-14 lg:py-16"><div className="shell"><div className="border-t border-espresso/20 pt-6"><p className="v2-kicker text-brass-deep">{dict.nav.shop}</p><h2 className="display-lg mt-4 text-espresso">{dict.shopPage.catalog}</h2></div>
 <div className="mt-8 flex flex-wrap items-center gap-2 border-b border-espresso/15 pb-5" role="group" aria-label={dict.shop.filter}>{([{id:"all",title:dict.shop.all},...rituals.map(r=>({id:r.id,title:r.title[locale]}))] as {id:RitualId|"all";title:string}[]).map(r=><button key={r.id} type="button" aria-pressed={ritual===r.id} onClick={()=>{setRitual(r.id);setPage(1);}} className={cn("min-h-11 px-3 py-2 text-[0.625rem] tracking-[0.16em] uppercase transition-colors duration-500 sm:px-4",ritual===r.id?"bg-burgundy text-ivory":"text-ink-muted hover:bg-ivory hover:text-espresso")}>{r.title}</button>)}<span role="status" aria-live="polite" className="label-xs ms-auto text-ink-muted">{shown.length} {dict.shop.count}</span></div>
 <div id="shop-products" className="scroll-mt-[calc(var(--chrome-h)+1rem)]">{shown.length===0?<p className="py-12 text-ink-muted">{dict.shop.empty}</p>:<ul className="mt-8 grid grid-cols-1 gap-3 min-[360px]:grid-cols-2 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">{shown.slice((activePage-1)*PAGE_SIZE,activePage*PAGE_SIZE).map((p,index)=><li key={p.slug} className="group min-w-0"><ShopProductCard product={p} index={(activePage-1)*PAGE_SIZE+index} locale={locale} dict={dict} discoverLabel={dict.shopPage.product}/></li>)}</ul>}</div>
 {pages>1&&<nav aria-label={dict.shopPage.page} className="mt-10 flex flex-wrap items-center justify-center gap-5"><button type="button" disabled={activePage===1} onClick={()=>changePage(activePage-1)} className="label-xs min-h-11 px-3 disabled:opacity-40">{dict.shopPage.previous}</button><span className="label-xs">{dict.shopPage.page} {activePage} {dict.shopPage.of} {pages}</span><button type="button" disabled={activePage===pages} onClick={()=>changePage(activePage+1)} className="label-xs min-h-11 px-3 disabled:opacity-40">{dict.shopPage.next}</button></nav>}</div></section>;
}
