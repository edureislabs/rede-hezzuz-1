import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;

  if (!session) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const userId = Number(session);
  const { productId } = await req.json();

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    return NextResponse.json({ error: "Produto não encontrado" }, { status: 404 });
  }

  // cria compra como PENDING
  const purchase = await prisma.purchase.create({
    data: {
      userId,
      productId,
      status: "PENDING",
    },
  });

  const payment = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          title: product.name,
          quantity: 1,
          unit_price: product.price,
        },
      ],
      external_reference: purchase.id,
      notification_url: `${process.env.NEXT_PUBLIC_URL}/api/shop/webhook`,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_URL}/shop/success`,
        failure: `${process.env.NEXT_PUBLIC_URL}/shop/failure`,
      },
      auto_return: "approved",
    }),
  });

  const data = await payment.json();

  return NextResponse.json({ init_point: data.init_point });
}