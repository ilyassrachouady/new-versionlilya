import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { rituals } from "@/lib/content";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const frame = {
  tall: "inset-x-[28%] top-[10%] bottom-[36%]",
  column: "inset-x-[24%] top-[8%] bottom-[36%]",
  jar: "inset-x-[14%] top-[12%] bottom-[36%]",
} as const;

/** Four worlds, each an arch with one object standing in it. */
export function TheRitual({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="surface-grain relative overflow-hidden bg-espresso py-20 text-ivory sm:py-28 lg:py-36">
      <div
        aria-hidden
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: "url(/textures/plaster-espresso.jpg)",
          backgroundSize: "cover",
        }}
      />
      <div className="shell relative z-10">
        <SectionHeader
          eyebrow={dict.ritual.eyebrow}
          title={dict.ritual.title}
          body={dict.ritual.body}
          tone="light"
          align="center"
        />

        <ul className="mt-16 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-7">
          {rituals.map((ritual, index) => (
            <Reveal as="li" key={ritual.id} delay={index * 0.08}>
              <Link
                href={href(`/collections/${ritual.id}`, locale)}
                className="group block focus-visible:outline-offset-4"
              >
                <div className="arch relative aspect-[3/4.4] overflow-hidden bg-amber">
                  <Image
                    src={ritual.texture}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 45vw, 22vw"
                    className="object-cover transition-transform duration-[1400ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 transition-opacity duration-700 group-hover:opacity-80"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(23,14,12,0.15) 0%, rgba(23,14,12,0.30) 40%, rgba(23,14,12,0.88) 100%)",
                    }}
                  />

                  <span
                    aria-hidden
                    className="absolute top-5 left-1/2 -translate-x-1/2 font-display text-[0.75rem] tracking-[0.3em] text-ivory/60 rtl:translate-x-1/2"
                  >
                    {ritual.index}
                  </span>

                  {/* Warm pedestal so cutout edges never sit on raw dark. */}
                  <div
                    aria-hidden
                    className="absolute inset-x-[12%] top-[14%] bottom-[30%] rounded-[50%] opacity-90"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 58%, rgba(243,237,227,0.22) 0%, rgba(243,237,227,0.08) 42%, transparent 70%)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-[22%] bottom-[32%] h-8"
                    style={{
                      background:
                        "radial-gradient(50% 50% at 50% 50%, rgba(8,4,4,0.55), transparent 72%)",
                    }}
                  />

                  <div
                    className={`absolute ${frame[ritual.heroAspect]} transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2`}
                  >
                    <Image
                      src={ritual.hero}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 30vw, 14vw"
                      className="object-contain drop-shadow-[0_14px_22px_rgba(10,5,4,0.6)]"
                    />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 px-4 pb-6 text-center sm:px-5">
                    <h3 className="display-md text-ivory">{ritual.title[locale]}</h3>
                    <p className="mt-2 text-[0.8rem] leading-snug text-ivory/60">
                      {ritual.line[locale]}
                    </p>
                    <span
                      aria-hidden
                      className="mx-auto mt-4 block h-px w-8 origin-center scale-x-0 bg-brass-light transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
                    />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
