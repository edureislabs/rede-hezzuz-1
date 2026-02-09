"use client";

import { useEffect, useState } from "react";
import { FaServer } from "react-icons/fa";

type Status = {
  online: boolean;
  players: number;
  maxPlayers?: number;
};

export default function ServerStatusMini() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        setLoading(true);
        const res = await fetch(
          "https://api.mcstatus.io/v2/status/java/hezzuz.com"
        );
        const data = await res.json();

        setStatus({
          online: data.online,
          players: data.players?.online ?? 0,
          maxPlayers: data.players?.max ?? 100,
        });
      } catch {
        setStatus({ online: false, players: 0 });
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gray-700/50 text-xs">
        <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></div>
        <span className="text-gray-300">Carregando...</span>
      </div>
    );
  }

  if (!status) return null;

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm
      ${
        status.online
          ? "bg-gradient-to-r from-green-600/90 to-emerald-600/90 text-white border border-green-500/30"
          : "bg-gradient-to-r from-red-600/90 to-rose-600/90 text-white border border-red-500/30"
      }`}
    >
      <div className={`w-2 h-2 rounded-full ${status.online ? 'animate-pulse' : ''} ${status.online ? 'bg-green-300' : 'bg-red-300'}`}></div>
      <div className="flex items-center gap-1">
        <FaServer className="text-[10px]" />
        <span>{status.online ? "ONLINE" : "OFFLINE"}</span>
        <span className="text-white/70">·</span>
        <span>{status.players}/{status.maxPlayers || 100}</span>
      </div>
    </div>
  );
}