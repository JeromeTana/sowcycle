import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Loader from "@/components/Loader";
import {
  ibmPlexSansThaiFont,
  ibmPlexSansThaiLoopedFont,
  kanitFont,
  mitrFont,
  notoSansThaiFont,
  sarabunFont,
} from "@/utils/fonts";
import Navigation from "@/components/Navigation";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Home - SowCycle",
  description: "Sow breeding cycles management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${kanitFont.variable} ${mitrFont.variable} ${notoSansThaiFont.variable} ${sarabunFont.variable}`}
        suppressHydrationWarning
      >
        <main className="max-w-screen-sm m-auto flex flex-col gap-2 px-2 py-8">
          <div className="mb-4">
            <LogoutButton />
          </div>
          {children}
          <Navigation />
        </main>
        <Toaster />
        <Loader />
      </body>
    </html>
  );
}
