import Image from "next/image";

import type { Locale } from "@/lib/i18n/config";

const copy: Record<Locale, { label: string; iso: string; ammps: string }> = {
  en: {
    label: "Certified",
    iso: "ISO 22716 laboratory",
    ammps: "AMMPS",
  },
  fr: {
    label: "Certifié",
    iso: "Laboratoire ISO 22716",
    ammps: "AMMPS",
  },
  ar: {
    label: "معتمد",
    iso: "مختبر ISO 22716",
    ammps: "AMMPS",
  },
};

export function TrustMarks({ locale }: { locale: Locale }) {
  const text = copy[locale];

  return (
    <section aria-label={text.label} className="border-y border-[#173326]/10 bg-[#f7f1e8] text-[#173326]">
      <div className="shell flex flex-col items-center gap-4 py-3.5 sm:flex-row sm:justify-between sm:gap-8 sm:py-4">
        <p className="label-xs shrink-0 text-[#9a7a50]">{text.label}</p>
        <ul className="flex w-full items-center justify-center gap-6 sm:w-auto sm:justify-end sm:gap-10">
          <li className="flex items-center gap-3">
            <Image
              src="/trust/iso-22716.png"
              alt={text.iso}
              width={902}
              height={282}
              className="h-11 w-auto max-w-[16rem] object-contain sm:h-12"
            />
          </li>
          <li aria-hidden className="h-6 w-px bg-[#173326]/15" />
          <li className="flex items-center gap-3">
            <Image
              src="/trust/ammps.png"
              alt={text.ammps}
              width={640}
              height={390}
              className="h-11 w-auto max-w-[9rem] object-contain sm:h-12"
            />
          </li>
        </ul>
      </div>
    </section>
  );
}
