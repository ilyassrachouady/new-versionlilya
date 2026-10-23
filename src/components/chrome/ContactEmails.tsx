"use client";
import { useContactContent } from "./editorial-context";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function ContactEmails({
  className,
  linkClassName,
}: {
  dict: Dictionary;
  className?: string;
  linkClassName?: string;
}) {
  const contact = useContactContent();
  return (
    <p className={className}>
      {[contact.email, contact.secondaryEmail].filter(Boolean).map((address) => (
        <a key={address} href={`mailto:${address}`} className={`block ${linkClassName ?? ""}`}>
          {address}
        </a>
      ))}
    </p>
  );
}
