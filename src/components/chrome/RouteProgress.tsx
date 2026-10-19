"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Thin bar while a client navigation is in flight. The previous page stays on screen. */
export function RouteProgress() {
  const pathname = usePathname();
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(false);
  }, [pathname]);

  useEffect(() => {
    function isAppLink(anchor: HTMLAnchorElement) {
      if (anchor.target && anchor.target !== "_self") return false;
      if (anchor.hasAttribute("download")) return false;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return false;
      try {
        const url = new URL(href, window.location.href);
        if (url.origin !== window.location.origin) return false;
        return url.pathname !== window.location.pathname || url.search !== window.location.search;
      } catch {
        return false;
      }
    }

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }
      const anchor = (event.target as HTMLElement | null)?.closest("a");
      if (anchor && isAppLink(anchor)) setActive(true);
    }

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-x-0 top-0 z-[200] h-[2px] overflow-hidden ${active ? "opacity-100" : "opacity-0"}`}
    >
      <span className={`block h-full origin-left bg-brass ${active ? "animate-route-progress" : "scale-x-0"}`} />
    </div>
  );
}
