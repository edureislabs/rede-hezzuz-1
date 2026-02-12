"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao fazer login.");
        setLoading(false);
        return;
      }

      // Redireciona para perfil
      router.push("/perfil");
    } catch (error) {
      setError("Erro de conexão com o servidor.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-900 to-orange-900 px-4">
      <div className="w-full max-w-md bg-black/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white">
        
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
          Entrar
        </h1>

        <p className="text-center text-gray-400 mt-2">
          Acesse sua conta da Rede Hezzuz
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Nickname
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Seu nickname no Minecraft"
              className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Senha
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-900/40">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg font-bold text-black
                       bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300
                       hover:brightness-110 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Não tem conta?{" "}
            <Link
              href="/register"
              className="text-orange-400 hover:text-orange-300 font-semibold"
            >
              Criar conta
            </Link>
          </p>

          <p className="mt-4">
            <Link href="/" className="hover:text-white transition">
              ← Voltar para o site
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}