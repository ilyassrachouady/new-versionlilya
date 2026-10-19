import type { Metadata } from "next";
import { headers } from "next/headers";
import { Bodoni_Moda, Inter } from "next/font/google";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { requireAdminSession } from "@/lib/admin-auth";

const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["400", "500"], style: ["normal", "italic"], display: "swap", variable: "--font-bodoni" });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "Bureau de la Maison", template: "%s — Maison Lilya Zahra" },
  description: "L’espace d’administration privé de Maison Lilya Zahra.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isLogin = pathname === "/admin/login" || pathname.startsWith("/admin/login/");
  const fonts = `${bodoni.variable} ${inter.variable}`;

  if (isLogin) {
    return <div lang="fr" className={fonts}>{children}</div>;
  }

  const admin = await requireAdminSession();
  return <div lang="fr" className={fonts}><DashboardShell admin={admin}>{children}</DashboardShell></div>;
}
