"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (nickname.length < 3) {
      setError("Nickname deve ter pelo menos 3 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Erro ao criar conta.");
        setLoading(false);
        return;
      }

      // Redireciona direto para o perfil (login automático)
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
          Criar Conta
        </h1>

        <p className="text-center text-gray-400 mt-2">
          Junte-se à Rede Hezzuz
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Nickname no Minecraft
            </label>
            <input
              type="text"
              required
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Seu nickname"
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
              placeholder="Mínimo 6 caracteres"
              className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Confirmar Senha
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Digite novamente"
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
            {loading ? "Criando conta..." : "Criar Conta"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          <p>
            Já tem conta?{" "}
            <Link
              href="/login"
              className="text-orange-400 hover:text-orange-300 font-semibold"
            >
              Fazer login
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