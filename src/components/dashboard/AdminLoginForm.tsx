"use client";

import { useActionState } from "react";

import { sendAdminMagicLink, type MagicLinkState } from "@/app/admin/login/actions";
import { SubmitButton } from "@/components/dashboard/SubmitButton";

const initial: MagicLinkState = null;

export function AdminLoginForm({ error, next = "/admin" }: { error?: string; next?: string }) {
  const [state, action] = useActionState(sendAdminMagicLink, initial);

  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={next} />
      {error && (
        <p className="border border-[#cda79f] bg-[#fff6f1] px-4 py-3 text-sm text-[#8d5048]" role="alert">
          {error}
        </p>
      )}
      {state?.message && (
        <p
          className={
            state.sent
              ? "border border-[#c7d4c6] bg-[#f3f7f2] px-4 py-3 text-sm text-[#365c45]"
              : "border border-[#cda79f] bg-[#fff6f1] px-4 py-3 text-sm text-[#8d5048]"
          }
          role="status"
        >
          {state.message}
        </p>
      )}
      <label className="block text-xs tracking-[0.12em] text-[#81756b] uppercase">
        E-mail
        <input
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="bonjour@maisonlilyazahra.com"
          className="mt-2 h-12 w-full border border-[#d5cabc] bg-[#fbf8f2] px-3 text-sm text-[#173326] outline-none"
        />
      </label>
      <SubmitButton pendingLabel="Envoi du lien…" className="h-12 w-full rounded-none">
        Recevoir un lien de connexion
      </SubmitButton>
      <p className="text-[0.75rem] leading-relaxed text-[#8a7f74]">
        Aucun mot de passe. Le lien n’est valable qu’une fois, et seulement pour les comptes déjà autorisés.
      </p>
    </form>
  );
}
