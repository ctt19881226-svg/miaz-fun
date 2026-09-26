import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Miaz.fun — Mia's creative world",
  description: "Games, comics, stories and little AI experiments made by Mia.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
