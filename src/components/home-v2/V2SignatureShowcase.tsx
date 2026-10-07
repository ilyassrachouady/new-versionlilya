"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Reveal } from "@/components/ui/Reveal";
import { href, type Locale } from "@/lib/i18n/config";
import { signatureCopy, type SignatureId } from "@/lib/signature-collections";
import styles from "./V2SignatureShowcase.module.css";

const chapters: SignatureId[] = ["fleur-doranger", "the-vert", "safran", "ambre-musc"];
const copy = {
  en: { label:"Signature", discover:"Discover", names:["Fleur d’Oranger", "Thé Vert", "Safran", "Ambre Musc"], lines:["A world of warmth and light.", "A calm, botanical world.", "A world in golden light.", "A world of depth and shadow."] },
  fr: { label:"Signature", discover:"Découvrir", names:["Fleur d’Oranger", "Thé Vert", "Safran", "Ambre Musc"], lines:["Un univers de chaleur et de lumière.", "Un univers végétal, tout en calme.", "Un univers de lumière dorée.", "Un univers de profondeur et d’ombre."] },
  ar: { label:"التوقيع", discover:"اكتشف", names:["زهر البرتقال", "الشاي الأخضر", "الزعفران", "العنبر والمسك"], lines:["عالم من الدفء والنور.", "عالم نباتي هادئ.", "عالم من الضوء الذهبي.", "عالم من العمق والظلال."] },
};
const ease = [0.22, 1, 0.36, 1] as const;

function Campaign({ id, index, locale }: { id: SignatureId; index:number; locale:Locale }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion();
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1100px) and (hover: hover) and (pointer: fine)");
    const update = () => setDesktop(query.matches);
    update(); query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  const { scrollYProgress } = useScroll({ target:ref, offset:["start end", "end start"] });
  const scale = useTransform(scrollYProgress, [0,1], [1,1.008]);
  const text = copy[locale];
  const source = `/campaign-v2/signatures/${id}-final.webp`;
  const rise = { hidden: { opacity:0, y:12 }, visible: { opacity:1, y:0 } };
  const words = text.names[index].split(" ");
  return (
    <Link ref={ref} href={href(`/signature-collections/${id}`,locale)} className={`${styles.campaign} ${styles[id]} ${index%2 ? styles.reverse : ""}`}>
      <div aria-hidden className={styles.veil} />
      <motion.div className={styles.photograph} initial={reduced ? false : {clipPath:"inset(0 2% 0 2%)",opacity:0.6}} whileInView={{clipPath:"inset(0 0% 0 0%)",opacity:1}} viewport={{once:true,amount:0.15}} transition={{duration:0.75,ease}}>
        <motion.div className={styles.drift} style={{scale:desktop && !reduced ? scale : 1}}>
          <Image src={source} alt={text.names[index]} width={id === "fleur-doranger" ? 1998 : 1997} height={id === "safran" ? 788 : 787} sizes="(max-width:1099px) 100vw, 76vw" quality={92} className={styles.image} />
        </motion.div>
      </motion.div>
      <motion.div className={styles.content} initial={reduced ? false : "hidden"} whileInView="visible" viewport={{once:true,amount:0.1}} transition={{staggerChildren:0.07,delayChildren:0.12}}>
        <motion.p className="v2-kicker" variants={rise} transition={{duration:0.55,ease}}>{text.label} <span dir="ltr">0{index+1}</span></motion.p>
        <motion.h3 className={`font-display ${styles.name}`} variants={rise} transition={{duration:0.55,ease}}>{words.map((word,i)=><span key={i}>{word}{i === words.length-1 ? "." : " "}</span>)}</motion.h3>
        <motion.p className={styles.description} variants={rise} transition={{duration:0.55,ease}}>{text.lines[index]}</motion.p>
        <motion.span className={styles.cta} variants={rise} transition={{duration:0.55,ease}}>{text.discover} {text.names[index]} <span aria-hidden>{locale === "ar" ? "←" : "→"}</span></motion.span>
      </motion.div>
    </Link>
  );
}

export function V2SignatureShowcase({ locale }: { locale:Locale }) {
  const heading = signatureCopy(locale);
  return (
    <section id="home-signatures" aria-labelledby="home-signatures-title" className={styles.section}>
      <div className="v2-shell"><Reveal className={styles.intro}><p className="v2-kicker">{heading.nav}</p><h2 id="home-signatures-title" className="v2-display-section mt-5">{heading.body}</h2></Reveal></div>
      <div className={styles.chapters}>{chapters.map((id,index)=><Campaign key={id} id={id} index={index} locale={locale} />)}</div>
    </section>
  );
}
