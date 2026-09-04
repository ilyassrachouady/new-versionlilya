import { Emblem } from "@/components/brand/Emblem";
import { Wordmark } from "@/components/brand/Wordmark";
import { ButtonLink } from "@/components/ui/Button";
import { PageFrame } from "@/components/layout/PageFrame";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { defaultLocale } from "@/lib/i18n/config";

export default function LocaleNotFound() {
  const dict = getDictionary(defaultLocale);
  return (
    <PageFrame>
      <div className="flex min-h-[70dvh] flex-col items-center justify-center px-6 py-24 text-center">
        <Emblem className="h-12 w-auto text-brass" />
        <Wordmark size="md" className="mt-8 text-espresso" />
        <h1 className="display-xl mt-10 max-w-lg text-balance text-espresso">
          {dict.common.notFoundTitle}
        </h1>
        <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
          {dict.common.notFoundBody}
        </p>
        <ButtonLink href="/en" className="mt-10">
          {dict.common.notFoundCta}
        </ButtonLink>
      </div>
    </PageFrame>
  );
}
