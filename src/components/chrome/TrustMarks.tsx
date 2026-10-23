import Image from "next/image";

import { Reveal } from "@/components/ui/Reveal";
import type { Locale } from "@/lib/i18n/config";

import { trustCopy } from "@/lib/trust-content";
import { managedContent } from "@/lib/storefront-content";
import { merge } from "@/lib/content-model";
export async function TrustMarks({ locale }: { locale: Locale }) {
  const text = merge(trustCopy[locale], await managedContent("trust", locale));

  return (
    <section
      aria-labelledby="quality-compliance-heading"
      className="border-y border-[#173326]/10 bg-[#f7f1e8] text-[#173326]"
    >
      <div className="v2-shell py-12 sm:py-14 lg:py-16">
        <div className="grid gap-9 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:gap-14 xl:gap-20">
          <div className="max-w-[35rem]">
            <Reveal>
              <p className="v2-kicker text-[#9a7a50]">{text.eyebrow}</p>
            </Reveal>

            <Reveal delay={0.05}>
              <h2
                id="quality-compliance-heading"
                className="font-display mt-5 max-w-[15ch] text-[2.15rem] leading-[1.02] tracking-[-0.025em] sm:text-[2.65rem] lg:text-[3rem]"
              >
                {text.heading}
              </h2>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-5 max-w-[31rem] text-[0.88rem] leading-[1.8] text-[#173326]/62 sm:text-[0.93rem]">
                {text.intro}
              </p>
            </Reveal>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {text.certifications.map((item, index) => (
              <Reveal
                as="article"
                key={item.index}
                delay={0.08 + index * 0.07}
                className="group flex min-h-[13.75rem] flex-col rounded-[16px] border border-[#173326]/12 bg-[#fbf6ee]/72 p-5 transition-[border-color,background-color,transform] duration-500 ease-out hover:-translate-y-[1px] hover:border-[#173326]/20 hover:bg-[#fcf8f2] sm:min-h-[14.5rem] sm:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="v2-index text-[#9a7a50]">{item.index}</span>
                  <span className="v2-kicker text-right text-[#173326]/46">{item.title}</span>
                </div>

                <div className="mt-5 flex min-h-[6.25rem] items-center rounded-[12px] border border-[#173326]/8 bg-[#fffaf3]/74 px-4 py-3 sm:min-h-[6.75rem] sm:px-5">
                  <Image
                    src={item.logo}
                    alt={item.logoAlt}
                    width={902}
                    height={390}
                    sizes="(max-width: 639px) 68vw, 260px"
                    className={`${item.logoClassName} object-contain object-left mix-blend-multiply transition-transform duration-500 ease-out group-hover:-translate-y-[1px]`}
                  />
                </div>

                <div className="mt-5 border-t border-[#173326]/10 pt-4">
                  <p className="max-w-[29rem] text-[0.94rem] leading-[1.55] text-[#173326] sm:text-[0.98rem]">
                    {item.body}
                  </p>
                  <p className="mt-2 text-[0.7rem] leading-relaxed tracking-[0.04em] text-[#173326]/48">
                    {item.note}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
