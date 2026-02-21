"use client";

import { useState } from "react";

type Package = {
  id: number;
  cash: number;
  price: number;
  popular?: boolean;
};

const packages: Package[] = [
  { id: 1, cash: 100, price: 5 },
  { id: 2, cash: 300, price: 12, popular: true },
  { id: 3, cash: 600, price: 20 },
  { id: 4, cash: 1200, price: 35 },
];

export default function LojaPage() {
  const [selected, setSelected] = useState<Package | null>(null);

async function handleBuy() {
  if (!selected) return;

  const res = await fetch("/api/auth/payment/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cash: selected.cash,
      price: selected.price,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    alert("Erro ao iniciar pagamento");
    return;
  }

  window.location.href = data.url;
}

  return (
    <main className="min-h-screen pt-28 px-6 bg-gradient-to-b from-black via-gray-900 to-black text-white">
      <div className="max-w-6xl mx-auto">

        {/* TÍTULO */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 bg-clip-text text-transparent">
            Loja de Cash
          </h1>
          <p className="text-gray-400 mt-2">
            Compre cash e receba automaticamente no servidor
          </p>
        </div>

        {/* PACOTES */}
        <div className="grid md:grid-cols-4 gap-6">
          {packages.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => setSelected(pkg)}
              className={`
                relative p-6 rounded-2xl border transition-all text-center
                ${selected?.id === pkg.id
                  ? "border-orange-500 bg-orange-500/10 scale-105"
                  : "border-gray-800 bg-gray-900/50 hover:border-orange-500"}
              `}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-red-500 to-orange-500 text-xs px-3 py-1 rounded-full font-bold">
                  MAIS VENDIDO
                </div>
              )}

              <div className="text-4xl font-extrabold text-orange-400 mb-2">
                {pkg.cash}
              </div>

              <div className="text-sm text-gray-400 mb-4">
                CASH
              </div>

              <div className="text-2xl font-bold">
                R$ {pkg.price.toFixed(2)}
              </div>
            </button>
          ))}
        </div>

        {/* RESUMO */}
        <div className="mt-12 max-w-md mx-auto bg-gray-900/60 border border-gray-800 rounded-2xl p-6 text-center">
          {selected ? (
            <>
              <h2 className="text-xl font-bold mb-2">
                Você selecionou
              </h2>

              <div className="text-3xl font-extrabold text-orange-400">
                {selected.cash} Cash
              </div>

              <div className="text-gray-400 mb-4">
                Valor: R$ {selected.price.toFixed(2)}
              </div>

              <button
                onClick={handleBuy}
                className="w-full py-3 rounded-xl font-bold text-black bg-gradient-to-r from-red-500 via-orange-400 to-yellow-300 hover:brightness-110 transition"
              >
                Comprar Agora
              </button>
            </>
          ) : (
            <p className="text-gray-400">
              Selecione um pacote para continuar
            </p>
          )}
        </div>

      </div>
    </main>
  );
}