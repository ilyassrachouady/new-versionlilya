"use client";

import { AlertTriangle } from "lucide-react";
import { AdminButton } from "@/components/dashboard/AdminUI";

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="flex min-h-[65vh] items-center justify-center"><div className="max-w-md border border-[#d8cfc1] bg-[#f9f5ef] p-8 text-center"><AlertTriangle className="mx-auto size-6 text-[#9a5c52]"/><p className="admin-label mt-5 text-[#9a5c52]">Bureau de la Maison</p><h1 className="admin-serif mt-3 text-3xl">Une erreur demande votre attention.</h1><p className="mt-3 text-sm leading-6 text-[#786d65]">L’espace de travail n’a pas pu être préparé. Vos données n’ont pas été modifiées.</p><div className="mt-6"><AdminButton><span onClick={reset}>Réessayer</span></AdminButton></div></div></div>;
}
