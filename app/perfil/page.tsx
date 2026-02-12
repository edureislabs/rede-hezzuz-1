"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  nickname: string;
  createdAt: string;
};

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        console.log("Dados recebidos do /me:", data);
        if (!data.user) {
          router.push("/login");
        } else {
          setUser(data.user);
        }
      })
      .catch((err) => {
        console.error("Erro ao carregar perfil:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen pt-28 px-6 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="max-w-4xl mx-auto bg-gradient-to-br from-gray-900/80 to-black/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-gray-800">
        <h1 className="text-3xl font-extrabold mb-6 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
          👤 Perfil do Jogador
        </h1>

        <div className="space-y-6">
          <div className="p-4 bg-gray-900/50 rounded-xl">
            <span className="text-gray-400 text-sm">Nickname</span>
            <p className="text-2xl font-bold text-white">{user.nickname}</p>
          </div>

          <div className="p-4 bg-gray-900/50 rounded-xl">
            <span className="text-gray-400 text-sm">Membro desde</span>
            <p className="text-lg text-gray-300">
              {new Date(user.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="px-6 py-3 rounded-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 hover:brightness-110 transition-all"
          >
            Sair da conta
          </button>
        </div>
      </div>
    </main>
  );
}