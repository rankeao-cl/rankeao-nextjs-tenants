import type { Metadata } from "next";
import { Inter, Rajdhani, Geist } from "next/font/google";
import { Providers } from "@/lib/providers";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Rankeao - Panel de Tienda",
  description: "Panel de control para tiendas de Rankeao Marketplace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("light", "font-sans", geist.variable)} data-theme="light" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${rajdhani.variable} font-[var(--font-body)] antialiased bg-[var(--background)] text-[var(--foreground)]`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
