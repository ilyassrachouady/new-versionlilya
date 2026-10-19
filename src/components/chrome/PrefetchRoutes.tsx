"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/** Warm the App Router cache so section switches reuse a page already fetched. */
export function PrefetchRoutes({ hrefs }: { hrefs: readonly string[] }) {
  const router = useRouter();

  useEffect(() => {
    hrefs.forEach((href) => {
      router.prefetch(href);
    });
  }, [hrefs, router]);

  return null;
}
