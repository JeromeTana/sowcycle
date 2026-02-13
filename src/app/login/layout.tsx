import type { Metadata, Viewport } from "next";
import "../globals.css";
import { interFont } from "@/utils/fonts";

export const metadata: Metadata = {
  title: "Login - SowCycle",
  description: "Login to SowCycle",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={interFont.variable}>{children}</body>
    </html>
  );
}
