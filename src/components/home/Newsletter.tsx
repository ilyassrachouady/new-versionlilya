"use client";

import { useState, type FormEvent } from "react";

import { Emblem } from "@/components/brand/Emblem";
import { Reveal } from "@/components/ui/Reveal";
import type { Dictionary } from "@/lib/i18n/dictionaries";

type Status = "idle" | "done" | "error";

export function Newsletter({ dict }: { dict: Dictionary }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Wire this to the maison's mailing provider; the UI contract stays.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setStatus("error");
      return;
    }
    setStatus("done");
    setEmail("");
  }

  return (
    <section className="surface-grain relative isolate overflow-hidden bg-forest py-16 text-cream sm:py-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-50"
        style={{
          backgroundImage: "url(/textures/plaster-espresso.jpg)",
          backgroundSize: "cover",
          mixBlendMode: "multiply",
        }}
      />

      <div className="shell flex flex-col items-center text-center">
        <Reveal className="flex flex-col items-center gap-4">
          <Emblem tone="auto" className="h-10 w-10 sm:h-11 sm:w-11" />
          <span className="eyebrow text-cream/70">{dict.newsletter.eyebrow}</span>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="display-xl mt-6 text-cream sm:mt-7">{dict.newsletter.title}</h2>
          <p className="mx-auto mt-4 max-w-md text-[0.9rem] leading-relaxed text-pretty text-cream/65 sm:mt-5 sm:text-[0.95rem]">
            {dict.newsletter.body}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-8 w-full max-w-lg sm:mt-10">
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label htmlFor="newsletter-email" className="sr-only">
                {dict.newsletter.placeholder}
              </label>
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder={dict.newsletter.placeholder}
                aria-invalid={status === "error"}
                aria-describedby="newsletter-status"
                className="h-12 w-full border border-cream/25 bg-transparent px-4 text-[0.9rem] text-cream placeholder:text-cream/40 transition-colors duration-500 focus:border-cream focus:outline-none sm:h-14 sm:px-5"
              />
            </div>
            <button
              type="submit"
              className="h-12 bg-cream px-8 text-[0.6875rem] tracking-[0.24em] text-forest uppercase transition-colors duration-500 hover:bg-ivory sm:h-14 sm:px-9"
            >
              {dict.newsletter.cta}
            </button>
          </form>

          <p
            id="newsletter-status"
            role="status"
            aria-live="polite"
            className="mt-4 text-[0.75rem] tracking-[0.12em] text-cream/50"
          >
            {status === "done"
              ? dict.newsletter.success
              : status === "error"
                ? dict.newsletter.error
                : dict.newsletter.consent}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
