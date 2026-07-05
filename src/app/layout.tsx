import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Cinzel, Inter, Lora } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cinzel",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-lora",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Fate / Stay Last Time 2.0",
    template: "%s — Fate / Stay Last Time 2.0",
  },
  description:
    "An immersive fan-fiction visual novel experience. The Seventh Holy Grail War begins in Fuyuki City. Read the last loop.",
  keywords: [
    "Fate",
    "Type-Moon",
    "visual novel",
    "fan fiction",
    "Holy Grail War",
    "Servant",
  ],
  authors: [{ name: "FATE-SLT Archive" }],
  openGraph: {
    title: "Fate / Stay Last Time 2.0",
    description: "The Seventh Holy Grail War. Read the last loop.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable} ${lora.variable}`}
    >
      <body className="bg-void text-ether font-ui antialiased">
        {children}
      </body>
    </html>
  );
}
