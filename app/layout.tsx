import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shabbir Hossain Azhaf Portfolio",
  description:
    "Portfolio of Shabbir Hossain Azhaf — graphic design, brand identity, social media design, company profiles, video editing and motion graphics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
