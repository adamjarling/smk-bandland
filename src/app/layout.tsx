import "./globals.css";

import type { Metadata } from "next";
import { Lexend } from "next/font/google";

const lexendSans = Lexend({
  variable: "--font-lexend-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bandland Availability",
  description: "View availability for Bandland at Semmelweiss Klinik.",
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
