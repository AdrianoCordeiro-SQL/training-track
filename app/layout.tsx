import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Importe o componente
import { RestTimer } from "@/components/RestTimer";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Training Track",
  description: "Gere os seus treinos com eficiência.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50`}>
        <Sidebar />

        <div className="flex-1 pl-0 md:pl-16 w-full relative">
          <Header />
          {children}
          <RestTimer />
        </div>
      </body>
    </html>
  );
}
