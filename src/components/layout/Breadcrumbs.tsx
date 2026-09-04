import Link from "next/link";

import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { href, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({
  trail,
  locale,
  tone = "dark",
}: {
  trail: Crumb[];
  locale: Locale;
  tone?: "dark" | "light";
}) {
  return (
    <>
      <JsonLd data={breadcrumbSchema(trail, locale)} />
      <nav aria-label="Breadcrumb">
        <ol className="flex flex-wrap items-center gap-2">
          {trail.map((crumb, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={crumb.path} className="flex items-center gap-2">
                {last ? (
                  <span
                    className={cn(
                      "label-xs",
                      tone === "dark" ? "text-espresso" : "text-ivory",
                    )}
                    aria-current="page"
                  >
                    {crumb.name}
                  </span>
                ) : (
                  <Link
                    href={href(crumb.path, locale)}
                    className={cn(
                      "label-xs transition-opacity duration-500 hover:opacity-70",
                      tone === "dark" ? "text-ink-faint" : "text-ivory/50",
                    )}
                  >
                    {crumb.name}
                  </Link>
                )}
                {!last && (
                  <span
                    aria-hidden
                    className={cn(
                      "text-[0.6rem]",
                      tone === "dark" ? "text-brass/70" : "text-ivory/35",
                    )}
                  >
                    /
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
