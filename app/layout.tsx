import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import BossBar from "../components/BossBar"; // Importe a BossBar aqui

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rede Hezzuz - Melhor Servidor de Minecraft",
  description: "O servidor onde a jogabilidade vira lenda 🔥",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-black text-white`}>
        {/* BossBar aparece em TODAS as páginas */}
        <BossBar />
        
        {/* Conteúdo específico de cada página */}
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}