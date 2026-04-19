import type { Metadata } from "next";
import { Inter, Fraunces, Lora } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  style: ["normal", "italic"],
});
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cognoesfera",
  description: "Paradigma Aleph · Sistema de Inteligencia Colectiva",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.className} ${fraunces.variable} ${lora.variable}`}>
      <body>{children}</body>
    </html>
  );
}
