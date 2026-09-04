import Image from "next/image";

import { OrnamentBand } from "@/components/brand/Ornament";
import { Reveal } from "@/components/ui/Reveal";
import { BrassRule } from "@/components/brand/BrassRule";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** The burgundy movement: the loudest colour in the house, used once. */
export function FromMorocco({ dict }: { dict: Dictionary }) {
  return (
    <section className="surface-grain relative isolate overflow-hidden bg-burgundy text-ivory">
      <Image
        src="/editorial/editorial-from-morocco.jpg"
        alt=""
        fill
        sizes="100vw"
        className="-z-10 object-cover opacity-100"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 55% at 20% 0%, rgba(214,138,92,0.22), transparent 65%), linear-gradient(180deg, rgba(38,12,11,0.35), rgba(38,12,11,0.78))",
        }}
      />

      <OrnamentBand className="text-brass-light opacity-40" />

      <div className="shell py-24 sm:py-32 lg:py-44">
        <Reveal className="flex items-center gap-4">
          <span className="eyebrow text-brass-light">{dict.morocco.eyebrow}</span>
          <BrassRule width="short" tone="ivory" className="w-16" />
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="display-hero mt-8 text-balance text-ivory">
            {dict.morocco.title.map((line, index) => (
              <span key={line} className="block">
                {index === 1 ? <span className="text-brass-light">{line}</span> : line}
              </span>
            ))}
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-24">
          <Reveal delay={0.1}>
            <p className="max-w-xl text-[1.0625rem] leading-relaxed text-pretty text-ivory/75">
              {dict.morocco.body}
            </p>
          </Reveal>

          <Reveal delay={0.14}>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-ivory/20 pt-8 sm:grid-cols-4 lg:grid-cols-2">
              {dict.morocco.tiles.map((tile) => (
                <div key={tile.label}>
                  <dt className="label-xs text-ivory/45">{tile.label}</dt>
                  <dd className="font-display mt-2 text-[1.35rem] leading-tight text-ivory">
                    {tile.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      <OrnamentBand className="text-brass-light opacity-40" />
    </section>
  );
}
