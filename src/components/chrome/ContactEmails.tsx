import { site } from "@/lib/site";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function ContactEmails({
  dict,
  className,
  linkClassName,
}: {
  dict: Dictionary;
  className?: string;
  linkClassName?: string;
}) {
  const [primary, secondary] = site.contactEmails;

  return (
    <p className={className}>
      <a href={`mailto:${primary.address}`} className={linkClassName}>
        {primary.label}
      </a>
      <span className="text-inherit"> {dict.common.contactOr} </span>
      <a href={`mailto:${secondary.address}`} className={linkClassName}>
        {secondary.label}
      </a>
    </p>
  );
}
