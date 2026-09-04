import Image from "next/image";
import Link from "next/link";

import { QuietLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { getProduct } from "@/lib/catalog";
import { edits } from "@/lib/content";
import { href, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { cn } from "@/lib/utils";

const frame = {
  tall: "inset-x-[22%] inset-y-[4%]",
  column: "inset-x-[18%] inset-y-[2%]",
  jar: "inset-x-[6%] inset-y-[6%]",
} as const;

/** Two ways through one house — a sequence each, never a gender filter. */
export function TheEdits({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="surface-grain relative bg-ivory py-20 sm:py-28 lg:py-36">
      <div className="shell">
        <SectionHeader eyebrow={dict.edits.eyebrow} title={dict.edits.title} align="center" />
      </div>

      <div className="mt-16 grid gap-px bg-brass/20 lg:grid-cols-2">
        {edits.map((edit, index) => {
          const items = edit.slugs
            .map((slug) => getProduct(slug))
            .filter((product) => product !== undefined);
          const dark = edit.id === "him";

          return (
            <Reveal
              key={edit.id}
              delay={index * 0.08}
              className={cn(
                "surface-grain relative isolate overflow-hidden px-6 py-14 sm:px-10 lg:px-14 lg:py-20",
                dark ? "bg-espresso text-ivory" : "bg-burgundy text-ivory",
              )}
            >
              <Image
                src={edit.texture}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="-z-10 object-cover opacity-90"
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                  background: dark
                    ? "radial-gradient(70% 60% at 80% 0%, rgba(167,122,69,0.22), transparent 60%), linear-gradient(180deg, rgba(15,9,8,0.35), rgba(15,9,8,0.72))"
                    : "radial-gradient(70% 60% at 20% 0%, rgba(214,138,92,0.26), transparent 60%), linear-gradient(180deg, rgba(38,12,11,0.25), rgba(38,12,11,0.7))",
                }}
              />

              <p className="eyebrow text-brass-light">{edit.line[locale]}</p>
              <h3 className="display-xl mt-5 text-ivory">{edit.title[locale]}</h3>
              <p className="mt-5 max-w-sm text-[0.95rem] leading-relaxed text-pretty text-ivory/70">
                {edit.body[locale]}
              </p>

              <ul className="mt-12 flex items-end gap-4 sm:gap-7">
                {items.map((product) => (
                  <li key={product.slug} className="flex-1">
                    <Link
                      href={href(`/products/${product.slug}`, locale)}
                      className="group block focus-visible:outline-offset-4"
                    >
                      <div className="relative h-44 sm:h-56">
                        <div
                          aria-hidden
                          className="absolute inset-x-[15%] bottom-0 h-5"
                          style={{
                            background:
                              "radial-gradient(50% 50% at 50% 50%, rgba(8,4,4,0.6), transparent 72%)",
                          }}
                        />
                        <div
                          className={cn(
                            "absolute transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-2",
                            frame[product.aspect],
                          )}
                        >
                          <Image
                            src={product.image}
                            alt=""
                            fill
                            sizes="(max-width: 640px) 26vw, 14vw"
                            className="object-contain drop-shadow-[0_12px_20px_rgba(8,4,4,0.55)]"
                          />
                        </div>
                      </div>
                      <p className="mt-4 text-center text-[0.75rem] leading-snug text-ivory/65 transition-colors duration-500 group-hover:text-ivory">
                        {product.name[locale]}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-12 border-t border-ivory/20 pt-7">
                <QuietLink href={href(`/collections/${edit.id}`, locale)} tone="light">
                  {dict.edits.cta}
                </QuietLink>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
