import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Importe o componente
import { RestTimer } from "@/components/RestTimer";

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
        {children}

        {/* Adicionamos o cronómetro aqui, fora do fluxo das páginas */}
        <RestTimer />
      </body>
    </html>
  );
}
