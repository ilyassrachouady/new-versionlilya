"use client";

import { Emblem } from "@/components/brand/Emblem";
import { Button } from "@/components/ui/Button";

export default function ErrorBoundary({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center bg-ivory px-6 pt-[var(--chrome-h)] text-center">
      <Emblem className="h-10 w-10 text-brass" />
      <h1 className="display-xl mt-8 max-w-lg text-balance text-espresso">
        The page could not be shown.
      </h1>
      <Button type="button" className="mt-10" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
