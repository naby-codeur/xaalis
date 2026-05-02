import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Xaalis",
  description:
    "Plateforme de gestion financière pour ONG, associations, PME et coopératives.",
  icons: {
    icon: "/logo_xaalis.png",
    shortcut: "/logo_xaalis.png",
    apple: "/logo_xaalis.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans text-zinc-900 [background:radial-gradient(ellipse_120%_80%_at_50%_-30%,rgba(139,92,246,0.18),transparent),radial-gradient(ellipse_55%_45%_at_100%_0%,rgba(20,184,166,0.12),transparent),linear-gradient(to_bottom,#fafafa,#f4f4f5)] dark:text-zinc-50 dark:[background:radial-gradient(ellipse_100%_70%_at_50%_-25%,rgba(139,92,246,0.2),transparent),radial-gradient(ellipse_50%_40%_at_100%_0%,rgba(45,212,191,0.08),transparent),linear-gradient(to_bottom,#0c0a09,#09090b)]">
        {children}
      </body>
    </html>
  );
}
