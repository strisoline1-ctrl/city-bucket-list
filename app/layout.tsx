import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "City Bucket List — Your AI Travel Concierge",
  description: "Discover the best bucket-list experiences in any city with your personal AI travel guide.",
  openGraph: {
    title: "City Bucket List",
    description: "Your personal travel concierge for every city",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-slate-50 text-slate-900">{children}</body>
    </html>
  );
}
