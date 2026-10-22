import type { Metadata } from "next";
import "./globals.css";
import { ScrollReveal } from "@/components/ScrollReveal";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://aburii-ttdi.josephinemah0419.chatgpt.site"),
  title: "ABURII TTDI | Japanese Yakiniku & Miyazaki A5 Wagyu",
  description: "Premium Japanese yakiniku and Miyazaki A5 Wagyu in TTDI, Kuala Lumpur.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<ScrollReveal /></body></html>;
}
