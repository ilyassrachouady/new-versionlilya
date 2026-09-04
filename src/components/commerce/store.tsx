"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { getProduct, type Product } from "@/lib/catalog";
import { baseCurrency, enabledCurrencies, type Currency } from "@/lib/currency";

type CartLine = { slug: string; quantity: number };
type Toast = { id: number; message: string };

type StoreValue = {
  lines: CartLine[];
  items: { product: Product; quantity: number }[];
  count: number;
  subtotalMAD: number;
  add: (slug: string, quantity?: number) => void;
  setQuantity: (slug: string, quantity: number) => void;
  remove: (slug: string) => void;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  hydrated: boolean;
  wishlist: string[];
  wished: Product[];
  isWished: (slug: string) => boolean;
  toggleWish: (slug: string) => void;
  toast: Toast | null;
  dismissToast: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

const CART_KEY = "mlz.bag.v1";
const CURRENCY_KEY = "mlz.currency.v1";
const WISH_KEY = "mlz.wish.v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [isOpen, setOpen] = useState(false);
  const [currency, setCurrencyState] = useState<Currency>(baseCurrency);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [toast, setToast] = useState<Toast | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const storedCart = window.localStorage.getItem(CART_KEY);
      const storedCurrency = window.localStorage.getItem(CURRENCY_KEY) as Currency | null;
      const storedWish = window.localStorage.getItem(WISH_KEY);

      let nextLines: CartLine[] = [];
      if (storedCart) {
        const parsed: unknown = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          nextLines = parsed
            .filter(
              (line): line is CartLine =>
                typeof line === "object" &&
                line !== null &&
                typeof (line as CartLine).slug === "string" &&
                Boolean(getProduct((line as CartLine).slug)),
            )
            .map((line) => ({
              slug: line.slug,
              quantity: Math.max(1, Number(line.quantity) || 1),
            }));
        }
      }

      let nextCurrency: Currency = baseCurrency;
      if (storedCurrency && enabledCurrencies.includes(storedCurrency)) {
        nextCurrency = storedCurrency;
      }

      let nextWish: string[] = [];
      if (storedWish) {
        const parsed: unknown = JSON.parse(storedWish);
        if (Array.isArray(parsed)) {
          nextWish = parsed.filter(
            (slug): slug is string => typeof slug === "string" && Boolean(getProduct(slug)),
          );
        }
      }

      window.setTimeout(() => {
        setLines(nextLines);
        setCurrencyState(nextCurrency);
        setWishlist(nextWish);
        setHydrated(true);
      }, 0);
    } catch {
      window.setTimeout(() => setHydrated(true), 0);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(CART_KEY, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(WISH_KEY, JSON.stringify(wishlist));
    } catch {
      /* ignore */
    }
  }, [wishlist, hydrated]);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToast({ id, message });
    window.setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 2400);
  }, []);

  const add = useCallback(
    (slug: string, quantity = 1) => {
      if (!getProduct(slug)) return;
      setLines((current) => {
        const existing = current.find((line) => line.slug === slug);
        if (existing) {
          return current.map((line) =>
            line.slug === slug ? { ...line, quantity: line.quantity + quantity } : line,
          );
        }
        return [...current, { slug, quantity }];
      });
      setOpen(true);
    },
    [],
  );

  const setQuantity = useCallback((slug: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.slug !== slug)
        : current.map((line) => (line.slug === slug ? { ...line, quantity } : line)),
    );
  }, []);

  const remove = useCallback((slug: string) => {
    setLines((current) => current.filter((line) => line.slug !== slug));
  }, []);

  const setCurrency = useCallback((next: Currency) => {
    setCurrencyState(next);
    try {
      window.localStorage.setItem(CURRENCY_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const toggleWish = useCallback(
    (slug: string) => {
      if (!getProduct(slug)) return;
      setWishlist((current) => {
        const next = current.includes(slug)
          ? current.filter((item) => item !== slug)
          : [...current, slug];
        if (!current.includes(slug)) {
          showToast("wish");
        }
        return next;
      });
    },
    [showToast],
  );

  const isWished = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);

  const value = useMemo<StoreValue>(() => {
    const items = lines
      .map((line) => {
        const product = getProduct(line.slug);
        return product ? { product, quantity: line.quantity } : null;
      })
      .filter((item): item is { product: Product; quantity: number } => item !== null);

    const wished = wishlist
      .map((slug) => getProduct(slug))
      .filter((product): product is Product => product !== undefined);

    return {
      lines,
      items,
      count: items.reduce((total, item) => total + item.quantity, 0),
      subtotalMAD: items.reduce(
        (total, item) => total + item.product.priceMAD * item.quantity,
        0,
      ),
      add,
      setQuantity,
      remove,
      isOpen,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      currency,
      setCurrency,
      hydrated,
      wishlist,
      wished,
      isWished,
      toggleWish,
      toast,
      dismissToast: () => setToast(null),
    };
  }, [
    lines,
    add,
    setQuantity,
    remove,
    isOpen,
    currency,
    setCurrency,
    hydrated,
    wishlist,
    isWished,
    toggleWish,
    toast,
  ]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used inside <StoreProvider>");
  return context;
}
