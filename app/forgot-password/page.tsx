"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaKey, FaEnvelope, FaShieldAlt } from "react-icons/fa";

export default function AlterarSenhaPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code" | "newPassword">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  // Passo 1: Solicitar código por email
  async function handleRequestCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "Erro ao solicitar código.", type: "error" });
        setLoading(false);
        return;
      }

      setMessage({ 
        text: "✅ Código enviado para seu email! Verifique sua caixa de entrada.", 
        type: "success" 
      });
      setStep("code");
    } catch (error) {
      setMessage({ text: "❌ Erro de conexão com o servidor.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // Passo 2: Verificar código
  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/auth/verify-reset-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "Código inválido.", type: "error" });
        setLoading(false);
        return;
      }

      setMessage({ 
        text: "✅ Código verificado! Agora defina sua nova senha.", 
        type: "success" 
      });
      setStep("newPassword");
    } catch (error) {
      setMessage({ text: "❌ Erro de conexão com o servidor.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // Passo 3: Alterar senha
  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPassword.length < 6) {
      setMessage({ text: "❌ A senha deve ter pelo menos 6 caracteres.", type: "error" });
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: "❌ As senhas não coincidem.", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ text: data.error || "Erro ao alterar senha.", type: "error" });
        setLoading(false);
        return;
      }

      setMessage({ 
        text: "✅ Senha alterada com sucesso! Redirecionando para login...", 
        type: "success" 
      });
      
      setTimeout(() => router.push("/login"), 2000);
    } catch (error) {
      setMessage({ text: "❌ Erro de conexão com o servidor.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  // Reenviar código
  async function handleResendCode() {
    setLoading(true);
    try {
      const res = await fetch("/api/auth/request-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setMessage({ text: "✅ Novo código enviado!", type: "success" });
      } else {
        setMessage({ text: "❌ Erro ao reenviar código.", type: "error" });
      }
    } catch {
      setMessage({ text: "❌ Erro de conexão.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-red-900 to-orange-900 px-4 pt-20">
      <div className="w-full max-w-md bg-black/70 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-white">
        
        {/* TÍTULO */}
        <div className="flex flex-col items-center gap-3 mb-8">
          <div className="bg-gradient-to-r from-red-600/30 to-orange-600/30 p-4 rounded-full">
            {step === "email" && <FaEnvelope className="text-orange-400 text-2xl" />}
            {step === "code" && <FaKey className="text-orange-400 text-2xl" />}
            {step === "newPassword" && <FaShieldAlt className="text-orange-400 text-2xl" />}
          </div>
          <h1 className="text-3xl font-extrabold text-center bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            {step === "email" && "Recuperar Senha"}
            {step === "code" && "Verificar Código"}
            {step === "newPassword" && "Nova Senha"}
          </h1>
          <p className="text-center text-gray-400 text-sm">
            {step === "email" && "Enviaremos um código para seu email"}
            {step === "code" && "Digite o código recebido"}
            {step === "newPassword" && "Digite sua nova senha"}
          </p>
        </div>

        {/* PASSO 1: EMAIL */}
        {step === "email" && (
          <form onSubmit={handleRequestCode} className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Email cadastrado
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@email.com"
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700
                           focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-black
                         bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300
                         hover:brightness-110 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Enviando código..." : "Enviar Código"}
            </button>
          </form>
        )}

        {/* PASSO 2: CÓDIGO */}
        {step === "code" && (
          <form onSubmit={handleVerifyCode} className="space-y-5">
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Código de verificação
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700 text-center text-xl tracking-widest
                           focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <p className="text-xs text-gray-500 mt-2">
                Verifique sua caixa de entrada e spam
              </p>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-bold text-black
                           bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300
                           hover:brightness-110 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? "Verificando..." : "Verificar Código"}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="w-full text-sm text-gray-400 hover:text-white hover:underline transition-colors"
              >
                ↻ Reenviar código
              </button>
            </div>
          </form>
        )}

        {/* PASSO 3: NOVA SENHA */}
        {step === "newPassword" && (
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Nova senha
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 rounded-lg bg-black/60 border border-gray-700
                           focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-gray-300">
                Confirmar nova senha
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-black
                         bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300
                         hover:brightness-110 transition-all duration-300 disabled:opacity-50"
            >
              {loading ? "Alterando senha..." : "Alterar Senha"}
            </button>
          </form>
        )}

        {/* MENSAGEM */}
        {message && (
          <div className={`mt-5 p-3 rounded-lg ${message.type === "success" ? "bg-green-900/40" : "bg-red-900/40"}`}>
            <p className={`text-sm ${message.type === "success" ? "text-green-400" : "text-red-400"}`}>
              {message.text}
            </p>
          </div>
        )}

        {/* VOLTAR */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            ← Voltar para login
          </button>
        </div>
      </div>
    </main>
  );
}