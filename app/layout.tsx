import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Providers } from "@/lib/providers";
import "./globals.css";
import { cn } from "@/lib/utils";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
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
    <html lang="es" className={cn("light", poppins.variable)} data-theme="light" suppressHydrationWarning>
      <body
        className="font-[var(--font-poppins)] antialiased bg-[var(--background)] text-[var(--foreground)]"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
