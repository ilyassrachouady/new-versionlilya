"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ChromeValue = {
  overlay: boolean;
  setOverlay: (value: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (value: boolean) => void;
};

const ChromeContext = createContext<ChromeValue | null>(null);

export function ChromeProvider({ children }: { children: ReactNode }) {
  const [overlay, setOverlay] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const value = useMemo(
    () => ({ overlay, setOverlay, searchOpen, setSearchOpen }),
    [overlay, searchOpen],
  );
  return <ChromeContext.Provider value={value}>{children}</ChromeContext.Provider>;
}

export function useChrome(): ChromeValue {
  const context = useContext(ChromeContext);
  if (!context) throw new Error("useChrome must be used inside <ChromeProvider>");
  return context;
}

/**
 * Rendered by any page that opens on a dark, full-bleed hero. Tells the
 * header to sit over the artwork until the reader scrolls past it.
 */
export function OverlayHeader() {
  const { setOverlay } = useChrome();
  useEffect(() => {
    setOverlay(true);
    return () => setOverlay(false);
  }, [setOverlay]);
  return null;
}
