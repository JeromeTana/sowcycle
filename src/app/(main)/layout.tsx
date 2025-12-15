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
        <div className="flex min-h-screen bg-gray-50/50">
          <div className="hidden md:block fixed inset-y-0 z-50 w-64">
            <Sidebar />
          </div>
          <main className="flex-1 md:pl-64">
            <div className="max-w-screen-sm md:max-w-5xl min-h-screen mx-auto flex flex-col  p-4 md:pb-8 md:p-8">
              {children}
            </div>
          </main>
        </div>
        <div className="md:hidden sticky bottom-0 left-0 right-0">
          <Navigation />
        </div>
        <Toaster />
        <Loader />
      </body>
    </html>
  );
}
