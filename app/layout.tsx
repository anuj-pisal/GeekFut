import type { Metadata } from "next";
import { Oswald, Archivo } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GeekFut - GeeksforGeeks Ultimate Team",
  description: "Turn your GeeksforGeeks profile into an Ultimate Team-style player card.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${oswald.variable} ${archivo.variable} antialiased`}
    >
      <body className="min-h-screen bg-[#070b09] flex flex-col selection:bg-gfg-green selection:text-white"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #11261a 0%, #070b09 70%), repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(255,255,255,0.02) 49px, rgba(255,255,255,0.02) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,255,255,0.02) 49px, rgba(255,255,255,0.02) 50px)'
        }}>
        <Header />
        <div className="pt-20 flex-1 flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
