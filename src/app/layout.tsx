import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Autosuz",
  description: "CRM de Gestión Automotriz - Autosuz",
  other: {
    "facebook-domain-verification": "2ifmhukhlouwtrdi442vnmo9xp8acc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta
          name="facebook-domain-verification"
          content="2ifmhukhlouwtrdi442vnmo9xp8acc"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
