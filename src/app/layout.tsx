import type { Metadata } from "next";
import { Cormorant_Garamond, Nunito, Caveat } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

const nunito = Nunito({
  weight: ["300", "400", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunito",
});

const caveat = Caveat({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "yapılacaklar — ama seninle ✨",
  description: "Serra & Kağan için romantik yapılacaklar listesi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="tr"
      className={`${cormorant.className} ${nunito.variable} ${caveat.variable}`}
    >
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
