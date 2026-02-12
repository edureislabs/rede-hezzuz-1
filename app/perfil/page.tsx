"use client";
export const dynamic = "force-dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type User = {
  nickname: string;
  email: string;
};

export default function PerfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("🔄 Carregando perfil...");
    
    fetch("/api/auth/me", {
      credentials: "include", // IMPORTANTE: para enviar cookies
    })
      .then((res) => {
        console.log("📊 Status da API /me:", res.status);
        return res.json();
      })
      .then((data) => {
        console.log("📦 Dados recebidos:", data);
        
        if (!data.user) {
          console.log("❌ Nenhum usuário na resposta, redirecionando...");
          router.push("/login");
        } else {
          console.log("✅ Usuário encontrado:", data.user);
          setUser(data.user);
        }
      })
      .catch((err) => {
        console.error("🔥 Erro ao carregar perfil:", err);
        setError("Erro ao carregar perfil");
      })
      .finally(() => {
        console.log("🏁 Carregamento finalizado");
        setLoading(false);
      });
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-orange-500 hover:bg-orange-600 px-6 py-2 rounded-lg"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Usuário não encontrado</p>
          <button
            onClick={() => router.push("/login")}
            className="bg-gradient-to-r from-red-500 to-orange-500 hover:brightness-110 px-6 py-2 rounded-lg"
          >
            Fazer Login
          </button>
        </div>
      </div>
    );
  }

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
            <span className="text-gray-400 text-sm">Email</span>
            <p className="text-lg text-gray-300">{user.email}</p>
          </div>
        </div>

        <hr className="my-8 border-gray-800" />

        <div className="grid md:grid-cols-2 gap-4">
          <button 
  onClick={() => router.push("/forgot-password")}
  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all px-6 py-3 rounded-xl font-semibold"
>
  Alterar senha
</button>

          <button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 transition-all px-6 py-3 rounded-xl font-semibold">
            Vincular Minecraft
          </button>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="text-sm text-gray-400 hover:text-red-400 transition-colors"
          >
            Sair da conta
          </button>
        </div>
      </div>
    </main>
  );
} 