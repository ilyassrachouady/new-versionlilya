"use client";

import { useState, type FormEvent } from "react";

import { Emblem } from "@/components/brand/Emblem";
import { BrassRule } from "@/components/brand/BrassRule";
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
    <section className="surface-grain relative isolate overflow-hidden bg-espresso py-20 text-ivory sm:py-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-80"
        style={{
          backgroundImage: "url(/textures/plaster-espresso.jpg)",
          backgroundSize: "cover",
        }}
      />

      <div className="shell flex flex-col items-center text-center">
        <Reveal className="flex flex-col items-center gap-4">
          <Emblem className="h-9 w-9 text-brass-light" />
          <span className="eyebrow text-brass-light">{dict.newsletter.eyebrow}</span>
          <BrassRule width="short" tone="ivory" className="w-16" />
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="display-xl mt-7 text-ivory">{dict.newsletter.title}</h2>
          <p className="mx-auto mt-5 max-w-md text-[0.95rem] leading-relaxed text-pretty text-ivory/65">
            {dict.newsletter.body}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-10 w-full max-w-lg">
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
                className="h-14 w-full border border-ivory/25 bg-transparent px-5 text-[0.9rem] text-ivory placeholder:text-ivory/40 transition-colors duration-500 focus:border-brass-light focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="h-14 bg-ivory px-9 text-[0.6875rem] tracking-[0.24em] text-espresso uppercase transition-colors duration-500 hover:bg-brass-light"
            >
              {dict.newsletter.cta}
            </button>
          </form>

          <p
            id="newsletter-status"
            role="status"
            aria-live="polite"
            className="mt-4 text-[0.75rem] tracking-[0.12em] text-ivory/50"
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
