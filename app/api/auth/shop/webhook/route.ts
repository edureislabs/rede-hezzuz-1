import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { Rcon } from "rcon-client";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("🔥 WEBHOOK RECEBIDO:", body);

    // 🔒 Validação mínima segura
    if (!body.data?.id) {
      console.log("⛔ Webhook sem data.id");
      return NextResponse.json({ ok: true });
    }

    const paymentId = body.data.id;

    // 🔍 Busca pagamento real no Mercado Pago
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

    // Só continua se aprovado
    if (payment.status !== "approved") {
      console.log("⏳ Pagamento ainda não aprovado");
      return NextResponse.json({ ok: true });
    }

    const purchaseId = payment.external_reference;

    if (!purchaseId) {
      console.log("❌ Sem external_reference");
      return NextResponse.json({ ok: true });
    }

    const purchase = await prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: {
        product: true,
        user: true,
      },
    });

    if (!purchase) {
      console.log("❌ Purchase não encontrada");
      return NextResponse.json({ ok: true });
    }

    // 🔒 ANTI DUPLICAÇÃO
    if (purchase.delivered) {
      console.log("⚠️ Já entregue anteriormente");
      return NextResponse.json({ ok: true });
    }

    // ✅ Atualiza banco primeiro
    await prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        paymentId: paymentId.toString(),
        status: "APPROVED",
        delivered: true,
      },
    });

    console.log("✅ Banco atualizado");

    // 🎮 ENVIA RCON
    const rcon = await Rcon.connect({
      host: process.env.RCON_HOST!,
      port: Number(process.env.RCON_PORT),
      password: process.env.RCON_PASSWORD!,
    });

    const command = purchase.product.command.replace(
      "{player}",
      purchase.user.nickname
    );

    console.log("🎮 Enviando comando:", command);

    await rcon.send(command);
    await rcon.end();

    console.log("🚀 Entrega concluída com sucesso");

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("❌ ERRO NO WEBHOOK:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}