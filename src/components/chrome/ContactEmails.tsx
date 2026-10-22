import { site } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function ContactEmails({
  className,
  linkClassName,
}: {
  dict: Dictionary;
  className?: string;
  linkClassName?: string;
}) {
  const [primary] = site.contactEmails;

  return (
    <p className={className}>
      <a href={`mailto:${primary.address}`} className={linkClassName}>
        {primary.label}
      </a>
    </p>
  );
}
