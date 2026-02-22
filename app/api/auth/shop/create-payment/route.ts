import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// ✅ Aceitar POST para webhooks do Mercado Pago
export async function POST(req: Request) {
  try {
    // O Mercado Pago envia os dados no corpo da requisição
    const body = await req.json();
    console.log("Webhook recebido:", body);

    // Extrair informações relevantes
    const { type, data } = body;
    
    // Verificar se é uma notificação de pagamento
    if (type === "payment") {
      const paymentId = data.id;
      
      // Buscar detalhes do pagamento no Mercado Pago
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      });
      
      const paymentData = await paymentResponse.json();
      
      // external_reference é o ID da compra que você enviou
      const purchaseId = paymentData.external_reference;
      
      // Verificar status do pagamento
      if (paymentData.status === "approved") {
        // Atualizar compra para aprovada
        await prisma.purchase.update({
          where: { id: purchaseId },
          data: { 
            status: "APPROVED",
            paymentId: paymentId.toString(),
          },
        });
        
        // TODO: Executar comandos no jogo (RCON)
        console.log(`Pagamento aprovado para compra: ${purchaseId}`);
      } else {
        // Atualizar status da compra
        await prisma.purchase.update({
          where: { id: purchaseId },
          data: { 
            status: paymentData.status === "rejected" ? "REJECTED" : "PENDING",
            paymentId: paymentId.toString(),
          },
        });
      }
    }

    // Sempre retornar 200 para o Mercado Pago
    return NextResponse.json({ received: true }, { status: 200 });
    
  } catch (error) {
    console.error("Erro no webhook:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}

// (Opcional) Aceitar GET para testes
export async function GET(req: Request) {
  return NextResponse.json({ message: "Webhook endpoint ativo" });
}