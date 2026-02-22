import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Rcon } from "rcon-client";

export async function POST(req: Request) {
  const body = await req.json();

  if (body.type !== "payment") {
    return NextResponse.json({ ok: true });
  }

  const paymentId = body.data.id;

  const payment = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    }
  ).then(res => res.json());

  if (payment.status !== "approved") {
    return NextResponse.json({ ok: true });
  }

  const purchaseId = payment.external_reference;

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { product: true, user: true },
  });

  if (!purchase) return NextResponse.json({ ok: true });

  // 🔒 ANTI DUPLICAÇÃO
  if (purchase.delivered) {
    return NextResponse.json({ ok: true });
  }

  // Atualiza pagamento
  await prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      paymentId: paymentId.toString(),
      status: "APPROVED",
      delivered: true,
    },
  });

  // 🎮 ENVIA RCON
  const rcon = await Rcon.connect({
    host: process.env.RCON_HOST!,
    port: Number(process.env.RCON_PORT),
    password: process.env.RCON_PASSWORD!,
  });

  await rcon.send(
    purchase.product.command.replace("{player}", purchase.user.nickname)
  );

  await rcon.end();

  return NextResponse.json({ ok: true });
}