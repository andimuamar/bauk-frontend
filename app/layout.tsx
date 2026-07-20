import type { Metadata } from "next";
import { Inter, Newsreader, Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "BAUK - Universitas Ibnu Sina",
    template: "%s | BAUK - Universitas Ibnu Sina",
  },
  description: "Biro Administrasi Umum dan Keuangan - Universitas Ibnu Sina",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${poppins.variable} ${newsreader.variable}`}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
