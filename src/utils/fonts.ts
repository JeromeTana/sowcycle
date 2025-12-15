import { IBM_Plex_Sans_Thai, IBM_Plex_Sans_Thai_Looped, Kanit, Mitr, Sarabun, Inter } from "next/font/google";

export const interFont = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const kanitFont = Kanit({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-kanit",
  display: "swap",
});

export const mitrFont = Mitr({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-mitr",
  display: "swap",
});

export const ibmPlexSansThaiFont = IBM_Plex_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-thai",
  display: "swap",
});

export const ibmPlexSansThaiLoopedFont = IBM_Plex_Sans_Thai_Looped({
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-sans-thai-looped",
  display: "swap",
});

export const notoSansThaiFont = IBM_Plex_Sans_Thai({
  subsets: ["latin", "thai"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

export const sarabunFont = Sarabun({
  subsets: ["latin", "thai"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});