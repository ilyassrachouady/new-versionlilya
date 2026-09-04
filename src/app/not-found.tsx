import { Emblem } from "@/components/brand/Emblem";
import { Wordmark } from "@/components/brand/Wordmark";
import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-ivory px-6 text-center">
      <Emblem className="h-12 w-12 text-brass" />
      <Wordmark size="lg" className="mt-8 text-espresso" />
      <h1 className="display-xl mt-10 max-w-lg text-balance text-espresso">
        Nothing at this address.
      </h1>
      <p className="mt-5 max-w-md text-[0.95rem] leading-relaxed text-ink-muted">
        The page you are looking for has moved, or never existed.
      </p>
      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <ButtonLink href="/en">Maison Lilya Zahra</ButtonLink>
        <ButtonLink href="/fr" variant="outline">
          FR
        </ButtonLink>
        <ButtonLink href="/ar" variant="outline">
          AR
        </ButtonLink>
      </div>
    </div>
  );
}
