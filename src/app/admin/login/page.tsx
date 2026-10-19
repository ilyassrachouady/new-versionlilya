import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/dashboard/AdminLoginForm";
import { Emblem } from "@/components/brand/Emblem";
import { getAdminSession } from "@/lib/admin-auth";
import { supabaseConfigState } from "@/lib/supabase/config";

export const metadata: Metadata = {
  title: "Connexion",
  robots: { index: false, follow: false },
};

const errors: Record<string, string> = {
  lien: "Ce lien n’est plus valable. Demandez-en un nouveau.",
  acces: "Cette adresse n’a pas accès au bureau. Écrivez à la Maison.",
  config: "Supabase n’est pas encore configuré sur ce serveur.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ erreur?: string; next?: string }>;
}) {
  const admin = await getAdminSession();
  if (admin) redirect("/admin");

  const { erreur, next } = await searchParams;
  const error =
    !supabaseConfigState.publicReady
      ? errors.config
      : erreur
        ? errors[erreur] ?? errors.lien
        : undefined;

  return (
    <div className="flex min-h-dvh items-center justify-center bg-[#f4efe7] px-5 py-16 text-[#25372e]">
      <div className="w-full max-w-md border border-[#d8cfc1] bg-[#f9f5ef] px-8 py-10 sm:px-10">
        <Emblem tone="dark" className="h-10 w-10" />
        <p className="admin-label mt-6 text-[#9a7a50]">Bureau de la Maison</p>
        <h1 className="admin-serif mt-3 text-3xl leading-tight">Un lien, pas un mot de passe.</h1>
        <p className="mt-4 text-sm leading-6 text-[#706b61]">
          Indiquez l’e-mail autorisé. Nous envoyons un lien unique pour ouvrir le bureau.
        </p>
        <AdminLoginForm error={error} next={next?.startsWith("/admin") ? next : "/admin"} />
      </div>
    </div>
  );
}
