import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    console.log("📩 /verify-email chamado");

    const body = await req.json();
    const { email, code } = body;

    console.log("📨 Dados recebidos:", { email, code });

    if (!email || !code) {
      console.log("❌ Email ou código ausente");
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    console.log("👤 Usuário encontrado:", user ? "SIM" : "NÃO");

    if (!user) {
      console.log("❌ Usuário não existe");
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    console.log("🔐 Código no banco:", user.verificationCode);
    console.log("⌨️ Código digitado:", code);

    if (user.verificationCode !== code) {
      console.log("❌ Código inválido");
      return NextResponse.json(
        { error: "Código inválido." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: true,
        verificationCode: null,
      },
    });

    console.log("✅ Email verificado com sucesso para:", email);

    return NextResponse.json({
      success: true,
      message: "Email confirmado com sucesso!",
    });
  } catch (error) {
    console.error("🔥 ERRO VERIFY EMAIL:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}