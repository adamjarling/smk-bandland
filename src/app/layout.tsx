import "./globals.css";

import { Geist, Geist_Mono } from "next/font/google";

import { Lexend } from "next/font/google";
import type { Metadata } from "next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lexendSans = Lexend({
  variable: "--font-lexend-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Semmelweiss Klinik Bandland",
  description: "View available for Bandland scheduling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${lexendSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
