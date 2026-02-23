import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Rcon } from "rcon-client";

export const runtime = "nodejs";

async function processPayment(paymentId: string) {
  console.log("🔎 Iniciando processamento:", paymentId);

  try {
    console.log("🌎 Buscando pagamento no Mercado Pago...");

    const paymentResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    console.log("📡 Status HTTP MP:", paymentResponse.status);

    if (!paymentResponse.ok) {
      console.log("❌ Erro ao consultar pagamento");
      return;
    }

    const payment = await paymentResponse.json();
    console.log("💳 Status pagamento:", payment.status);

    if (payment.status !== "approved") {
      console.log("⏳ Pagamento ainda não aprovado");
      return;
    }

    const purchaseId = payment.external_reference;
    console.log("🧾 External reference:", purchaseId);

    if (!purchaseId) {
      console.log("❌ Sem external_reference");
      return;
    }

    console.log("🔍 Buscando purchase no banco...");

    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: { product: true, user: true },
    });

    if (!purchase) {
      console.log("❌ Purchase não encontrada");
      return;
    }

    console.log("📦 Purchase encontrada:", purchase.id);
    console.log("📦 Já entregue?", purchase.delivered);

    if (purchase.delivered) {
      console.log("⚠️ Já entregue anteriormente");
      return;
    }

    console.log("💾 Atualizando banco...");

    await prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        paymentId: paymentId,
        status: "APPROVED",
        delivered: true,
      },
    });

    console.log("✅ Banco atualizado");

    console.log("🎮 Conectando RCON...");

    const rcon = await Rcon.connect({
      host: process.env.RCON_HOST!,
      port: Number(process.env.RCON_PORT),
      password: process.env.RCON_PASSWORD!,
    });

    console.log("🎮 RCON conectado");

    const command = purchase.product.command.replace(
      "{player}",
      purchase.user.nickname
    );

    console.log("📤 Enviando comando:", command);

    await rcon.send(command);
    await rcon.end();

    console.log("🚀 Entrega concluída com sucesso");
  } catch (err) {
    console.error("🔥 ERRO processPayment:", err);
  }
}

export async function POST(req: Request) {
  console.log("📩 WEBHOOK RECEBIDO");

  try {
    const body = await req.json().catch(() => null);

    console.log("📦 Body:", body);

    const paymentId = body?.data?.id;
    const action = body?.action;

    console.log("🔔 Action:", action);
    console.log("🆔 PaymentId:", paymentId);

    const response = NextResponse.json({ ok: true });

    if (paymentId) {
      setImmediate(() => {
        processPayment(paymentId);
      });
    } else {
      console.log("⚠️ Webhook sem paymentId");
    }

    return response;
  } catch (err) {
    console.error("🔥 ERRO WEBHOOK:", err);
    return NextResponse.json({ ok: true });
  }
}