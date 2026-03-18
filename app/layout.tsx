import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Training Track",
  description: "Faça a gestão dos seus treinos de forma inteligente.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${inter.className} bg-zinc-950 text-zinc-100 antialiased min-h-screen flex`}
      >
        <Sidebar />

        <main className="flex-1 min-h-screen pb-20 md:pb-0 md:pl-20 flex flex-col">
          <Header />
          {children}
        </main>
      </body>
    </html>
  );
}
