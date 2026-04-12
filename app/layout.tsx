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
    <html lang="es" className={poppins.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var d=JSON.parse(localStorage.getItem("rankeao-theme")||"{}");var t=d&&d.state&&d.state.theme;if(t==="dark"||t==="light"){document.documentElement.classList.add(t);document.documentElement.setAttribute("data-theme",t)}else{document.documentElement.classList.add("light");document.documentElement.setAttribute("data-theme","light")}}catch(e){document.documentElement.classList.add("light");document.documentElement.setAttribute("data-theme","light")}})()`,
          }}
        />
      </head>
      <body
        className="font-[var(--font-poppins)] antialiased bg-[var(--background)] text-[var(--foreground)]"
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
