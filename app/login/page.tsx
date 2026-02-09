"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showResendButton, setShowResendButton] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setShowResendButton(false);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // ✅ 1️⃣ BLOQUEAR LOGIN SE EMAIL NÃO ESTIVER VERIFICADO
        if (data.error === "Confirme seu email antes de entrar." || 
            data.error === "Email ainda não verificado") {
          setError("Seu email ainda não foi verificado. Confira sua caixa de entrada.");
          setShowResendButton(true); // ✅ 4️⃣ MOSTRA BOTÃO DE REENVIAR
        } else {
          setError(data.error || "Erro ao fazer login.");
        }
        setLoading(false);
        return;
      }

      alert("Login realizado com sucesso!");
      window.location.href = "/perfil";
    } catch (error) {
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  }

  // ✅ 4️⃣ FUNÇÃO PARA REENVIAR CÓDIGO
  async function handleResend() {
    if (!email) {
      setError("Digite seu email primeiro.");
      return;
    }

    setResendLoading(true);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        alert("Código reenviado para seu email!");
      } else {
        const data = await res.json();
        setError(data.error || "Erro ao reenviar código.");
      }
    } catch (error) {
      setError("Erro de conexão.");
    } finally {
      setResendLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-900 to-orange-900 px-4">
      <div className="w-full max-w-md bg-black/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white">
        
        {/* TÍTULO */}
        <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
          Entrar na Conta
        </h1>

        <p className="text-center text-gray-400 mt-2">
          Acesse sua conta da Rede Hezzuz
        </p>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          
          {/* EMAIL */}
          <div>
            <label className="block text-sm mb-1 text-gray-300">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setShowResendButton(false);
              }}
              placeholder="seuemail@email.com"
              className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          {/* SENHA */}
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

          {/* MENSAGEM DE ERRO */}
          {error && (
            <div className="p-3 rounded-lg bg-red-900/40 text-sm">
              <p className="text-red-400 mb-2">{error}</p>
              
              {/* ✅ 4️⃣ BOTÃO "REENVIAR CÓDIGO" */}
              {showResendButton && (
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendLoading}
                  className="text-sm text-blue-400 hover:text-blue-300 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resendLoading ? "Enviando..." : "↻ Reenviar código de verificação"}
                </button>
              )}
            </div>
          )}

          {/* BOTÃO LOGIN */}
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

        {/* LINKS */}
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

          <p className="mt-2">
<Link 
  href="/forgot-password" 
  className="text-orange-400 hover:text-orange-300 font-semibold"
>
  Esqueci minha senha
</Link>
          </p>

          <p className="mt-2">
            <Link href="/" className="hover:text-white transition">
              ← Voltar para o site
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}