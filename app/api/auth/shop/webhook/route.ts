import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Rcon } from "rcon-client";

export const runtime = "nodejs";

async function processPayment(paymentId: string) {
  const paymentResponse = await fetch(
    `https://api.mercadopago.com/v1/payments/${paymentId}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      },
    }
  );

  const payment = await paymentResponse.json();

  console.log("💳 Status pagamento:", payment.status);

  if (payment.status !== "approved") return;

  const purchaseId = payment.external_reference;
  if (!purchaseId) return;

  const purchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
    include: { product: true, user: true },
  });

  if (!purchase || purchase.delivered) return;

  await prisma.purchase.update({
    where: { id: purchaseId },
    data: {
      paymentId: paymentId,
      status: "APPROVED",
      delivered: true,
    },
  });

  const rcon = await Rcon.connect({
    host: process.env.RCON_HOST!,
    port: Number(process.env.RCON_PORT),
    password: process.env.RCON_PASSWORD!,
  });

  const command = purchase.product.command.replace(
    "{player}",
    purchase.user.nickname
  );

  await rcon.send(command);
  await rcon.end();

  console.log("🚀 Entrega concluída");
}

export async function POST(req: Request) {
  try {
    let body;

    try {
      body = await req.json();
    } catch {
      console.log("⚠️ POST sem JSON");
      return NextResponse.json({ ok: true });
    }

    console.log("🔥 WEBHOOK POST:", body);

    if (!body?.data?.id) return NextResponse.json({ ok: true });

    await processPayment(body.data.id);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ ERRO POST:", err);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const paymentId = searchParams.get("id");
    const topic = searchParams.get("topic");

    console.log("🔥 IPN GET:", paymentId, topic);

    if (topic !== "payment" || !paymentId)
      return NextResponse.json({ ok: true });

    await processPayment(paymentId);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("❌ ERRO GET:", err);
    return NextResponse.json({ error: "Erro" }, { status: 500 });
  }
}