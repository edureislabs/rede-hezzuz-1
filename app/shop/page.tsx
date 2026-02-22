"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Product = {
  id: string;
  name: string;
  price: number;
  type: "VIP" | "CASH";
};

type User = {
  id: number;
  nickname: string;
  email: string;
};

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/shop/products")
      .then(res => res.json())
      .then(setProducts);

    // Só tenta pegar usuário, mas NÃO redireciona
    fetch("/api/auth/me")
      .then(res => {
        if (!res.ok) return null;
        return res.json();
      })
      .then(data => {
        if (data) setUser(data);
      });
  }, []);

  async function handleBuy(productId: string) {
    // 🔥 BLOQUEIO AQUI
    if (!user) {
      router.push("/login");
      return;
    }

    const res = await fetch("/api/shop/create-payment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        userId: user.id,
      }),
    });

    const data = await res.json();

    if (data.init_point) {
      window.location.href = data.init_point;
    }
  }

  return (
    <div style={{ padding: "40px" }}>
      <h1>🛒 Loja Oficial</h1>

      {user ? (
        <p>Logado como: <strong>{user.nickname}</strong></p>
      ) : (
        <p style={{ color: "red" }}>
          Você precisa estar logado para comprar.
        </p>
      )}

      <div style={{ display: "grid", gap: "20px", marginTop: "30px" }}>
        {products.map(product => (
          <div
            key={product.id}
            style={{
              border: "1px solid #ccc",
              padding: "20px",
              borderRadius: "10px",
            }}
          >
            <h2>{product.name}</h2>
            <p>Tipo: {product.type}</p>
            <p>Preço: R$ {product.price.toFixed(2)}</p>

            <button
              onClick={() => handleBuy(product.id)}
              style={{
                padding: "10px 20px",
                backgroundColor: "#4CAF50",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Comprar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}