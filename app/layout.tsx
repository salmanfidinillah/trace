import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";

export const metadata: Metadata = {
  title: "TRACE — Kenali Paparan Data Digitalmu",
  description: "Periksa exposure data digital, pahami risikonya, dan ambil tindakan perlindungan.",
  icons: {
    icon: "/logo-revisi.png",
    shortcut: "/logo-revisi.png",
    apple: "/logo-revisi.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
