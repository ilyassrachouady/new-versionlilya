"use client";

import { AnimatePresence, motion } from "motion/react";

import { useStore } from "@/components/commerce/store";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function Toast({ dict }: { dict: Dictionary }) {
  const { toast, dismissToast } = useStore();
  const message =
    toast?.message === "wish"
      ? dict.toast.wished
      : toast?.message === "added"
        ? dict.toast.added
        : toast?.message;

  return (
    <AnimatePresence>
      {toast && message && (
        <motion.div
          role="status"
          aria-live="polite"
          className="pointer-events-auto fixed bottom-6 start-1/2 z-[100] -translate-x-1/2 rtl:translate-x-1/2"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            onClick={dismissToast}
            className="bg-espresso px-5 py-3 text-[0.625rem] tracking-[0.22em] text-ivory uppercase shadow-[0_12px_32px_rgba(36,24,21,0.28)]"
          >
            {message}
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
