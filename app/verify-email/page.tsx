"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEnvelopeOpenText, FaCheckCircle } from "react-icons/fa";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [emailFromUrl]);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const res = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setMessage(data.error || "Erro ao verificar email.");
      return;
    }

    setMessage("Email confirmado! Redirecionando para login...");
    setTimeout(() => router.push("/login"), 1500);
  }

  async function handleResendCode() {
    if (!email) {
      setMessage("Digite seu email primeiro.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage("✅ Novo código enviado para seu email!");
      } else {
        setMessage("❌ Erro ao reenviar código.");
      }
    } catch {
      setMessage("❌ Erro de conexão.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-900 to-orange-900 px-4">
      <form
        onSubmit={handleVerify}
        className="w-full max-w-sm rounded-2xl border border-orange-800/50
                   bg-black/70 backdrop-blur-lg
                   p-8 space-y-5 shadow-2xl text-white"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="bg-gradient-to-r from-red-600/30 to-orange-600/30 p-4 rounded-full">
            <FaEnvelopeOpenText className="text-orange-400 text-2xl" />
          </div>
          <h1 className="text-3xl font-extrabold bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            Verificar Email
          </h1>
          <p className="text-sm text-gray-400">
            Digite o código que enviamos para seu email
          </p>
        </div>

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/60 border border-gray-700
                     focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          required
        />

        <input
          type="text"
          placeholder="Código de verificação"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-3 rounded-lg bg-black/60 border border-gray-700
                     tracking-widest text-center text-lg
                     focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          required
        />

        <div className="space-y-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2
                       bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300
                       hover:brightness-110 text-black
                       p-3 rounded-lg font-bold
                       transition-all duration-300 disabled:opacity-50"
          >
            <FaCheckCircle />
            {loading ? "Verificando..." : "Confirmar Email"}
          </button>

          <button
            type="button"
            onClick={handleResendCode}
            disabled={loading || !email}
            className="w-full text-sm text-gray-400 hover:text-white
                       hover:underline transition-colors disabled:opacity-50"
          >
            ↻ Reenviar código
          </button>
        </div>

        {message && (
          <p className="text-center text-sm text-gray-300 mt-2">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="text-white text-center mt-10">Carregando...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
