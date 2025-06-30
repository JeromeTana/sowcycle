import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Loader from "@/components/Loader";
import {
  notoSansThaiFont,
  sarabunFont,
} from "@/utils/fonts";
import Navigation from "@/components/Navigation";
import TopBar from "@/components/TopBar";

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
        className={`${notoSansThaiFont.variable} ${sarabunFont.variable}`}
        suppressHydrationWarning
      >
        <TopBar />
        
        <main className="max-w-screen-sm min-h-screen m-auto flex flex-col gap-2 px-2 py-8">
          {children}
        </main>
        <Navigation />
        <Toaster />
        <Loader />
      </body>
    </html>
  );
}
