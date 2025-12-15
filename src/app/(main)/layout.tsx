import type { Metadata, Viewport } from "next";
import "../globals.css";
import { Toaster } from "@/components/ui/toaster";
import Loader from "@/components/Loader";
import { notoSansThaiFont, sarabunFont, interFont } from "@/utils/fonts";
import Navigation from "@/components/Navigation";
import TopBar from "@/components/TopBar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "Home - SowCycle",
  description: "Sow breeding cycles management system",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${notoSansThaiFont.variable} ${sarabunFont.variable} ${interFont.variable}`}
        suppressHydrationWarning
      >
        <div className="flex min-h-screen bg-secondary">
          <div className="fixed inset-y-0 z-50 hidden w-64 md:block">
            <Sidebar />
          </div>
          <main className="flex-1 md:pl-64">
            <div className="flex flex-col max-w-screen-sm min-h-screen p-4 mx-auto md:max-w-5xl md:pb-8 md:p-8">
              {children}
            </div>
          </main>
        </div>
        <div className="sticky bottom-0 left-0 right-0 md:hidden">
          <Navigation />
        </div>
        <Toaster />
        <Loader />
      </body>
    </html>
  );
}
