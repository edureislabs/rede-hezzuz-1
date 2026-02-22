"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import ServerStatusMini from "./ServerStatusMini";

import {
  FaHome,
  FaBook,
  FaShoppingCart,
  FaShareAlt,
  FaDiscord,
  FaInfoCircle,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

type User = {
  nickname: string;
};

export default function BossBar() {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

useEffect(() => {
  fetch("/api/auth/me", {
    credentials: "include"
  })
    .then(async (res) => {
      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data); // 🔥 aqui está a correção
    })
    .catch(() => setUser(null));
}, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gradient-to-r from-red-700 via-orange-600 to-yellow-500 shadow-lg">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* LOGO */}
        <div className="flex items-center gap-3">
          <Image
            src="/logohezzuz.png"
            alt="Logo Rede Hezzuz"
            width={40}
            height={40}
            priority
          />
          <span className="text-white font-extrabold text-xl tracking-wide">
            Rede Hezzuz
          </span>
        </div>

        {/* MENU DESKTOP */}
        <ul className="hidden md:flex gap-4 font-semibold text-sm">
          <li>
            <a href="/" className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-red-600/40">
              <FaHome className="text-yellow-300" />
              Início
            </a>
          </li>

          <li>
            <a href="/regras" className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-orange-500/40">
              <FaBook className="text-orange-300" />
              Regras
            </a>
          </li>

          <li>
            <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-blue-500/40">
              <FaInfoCircle className="text-blue-300" />
              Wiki
            </a>
          </li>

          <li>
            <a href="/shop" className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-green-500/40">
              <FaShoppingCart className="text-green-300" />
              Loja
            </a>
          </li>

          <li>
            <a href="#" className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-pink-500/40">
              <FaShareAlt className="text-pink-300" />
              Redes
            </a>
          </li>

          <li>
            <a
              href="https://discord.hezzuz.com/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-white hover:bg-indigo-600/40"
            >
              <FaDiscord className="text-indigo-300" />
              Discord
            </a>
          </li>
        </ul>

        {/* STATUS + LOGIN */}
        <div className="flex items-center gap-3">
          <ServerStatusMini />

          {/* DESKTOP LOGIN / PERFIL */}
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              <a
                href="/perfil"
                className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg text-white hover:bg-black/50 transition"
              >
                <FaUser />
                {user.nickname}
              </a>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg text-white hover:bg-red-700 transition"
              >
                <FaSignOutAlt />
                Sair
              </button>
            </div>
          ) : (
            <a
              href="/login"
              className="hidden md:flex items-center px-4 py-2 rounded-lg bg-black/40 hover:bg-black/60 text-white font-semibold transition"
            >
              Entrar
            </a>
          )}

          {/* BOTÃO MOBILE */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-white text-2xl font-bold hover:bg-black/20 p-2 rounded-lg"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* MENU MOBILE */}
      {open && (
        <div className="md:hidden bg-gradient-to-b from-red-900/95 to-orange-900/95 text-white px-6 py-6 space-y-3">
          <a href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-red-600/50">
            <FaHome /> Início
          </a>

          <a href="/regras" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-orange-600/50">
            <FaBook /> Regras
          </a>

          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-600/50">
            <FaInfoCircle /> Wiki
          </a>

          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-green-600/50">
            <FaShoppingCart /> Loja
          </a>

          <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-pink-600/50">
            <FaShareAlt /> Redes
          </a>

          {user ? (
            <>
              <a
                href="/perfil"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-black/50"
              >
                <FaUser /> {user.nickname}
              </a>

              <button
                onClick={handleLogout}
                className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-red-600 font-bold w-full"
              >
                <FaSignOutAlt /> Sair
              </button>
            </>
          ) : (
            <a
              href="/login"
              className="flex items-center justify-center px-4 py-3 rounded-lg bg-black/70 font-bold"
            >
              Entrar na Conta
            </a>
          )}

          <a
            href="https://discord.hezzuz.com/"
            target="_blank"
            className="flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 font-bold"
          >
            <FaDiscord /> Entrar no Discord
          </a>
        </div>
      )}
    </header>
  );
}
