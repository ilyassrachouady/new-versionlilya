import type { Dictionary } from "@/lib/i18n/dictionaries";
import { site } from "@/lib/site";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function BrandInstagramLink({
  dict,
  className,
  iconClassName = "size-4",
}: {
  dict: Dictionary;
  className?: string;
  iconClassName?: string;
}) {
  return (
    <a
      href={site.instagram}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
      aria-label={dict.footer.instagramAria}
    >
      <InstagramIcon className={iconClassName} />
      <span>{site.instagramHandle}</span>
    </a>
  );
}
