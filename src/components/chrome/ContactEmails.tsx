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
  return (
    <p className={className}>
      {site.contactEmails.map((contact) => (
        <a key={contact.address} href={`mailto:${contact.address}`} className={`block ${linkClassName ?? ""}`}>
          {contact.label}
        </a>
      ))}
    </p>
  );
}
