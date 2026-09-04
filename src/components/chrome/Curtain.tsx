"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { Emblem } from "@/components/brand/Emblem";

const SEEN_KEY = "mlz.curtain.v1";

/**
 * The house's opening gesture: a burgundy curtain carrying the emblem, lifted
 * once on arrival. Shown a single time per session — a signature that repeats
 * on every click stops being one.
 */
export function Curtain() {
  const [visible, setVisible] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    let seen = true;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = false;
    }
    if (seen) return;

    document.documentElement.style.overflow = "hidden";
    const show = window.setTimeout(() => setVisible(true), 0);
    const timer = window.setTimeout(() => {
      setVisible(false);
      document.documentElement.style.overflow = "";
      try {
        window.sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 1250);

    return () => {
      window.clearTimeout(show);
      window.clearTimeout(timer);
      document.documentElement.style.overflow = "";
    };
  }, [reduced]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          aria-hidden
          className="fixed inset-0 z-[999] flex items-center justify-center bg-burgundy"
          initial={{ y: 0 }}
          exit={{ y: "-101%" }}
          transition={{ duration: 0.95, ease: [0.65, 0, 0.35, 1] }}
          style={{
            backgroundImage: "url(/textures/plaster-espresso.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#1c3225",
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <Emblem tone="auto" className="h-16 w-16" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
