import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import { sendResetEmail } from "@/app/lib/email";

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório." },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // 🔐 Sempre retorna sucesso (anti-enumeração)
    if (!user) {
      return NextResponse.json({ success: true });
    }

    // 🔥 Gera código
    const resetCode = generateResetCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await prisma.user.update({
      where: { id: user.id },
      data: {
  resetCode,
  resetExpires: expiresAt,
},
    });

    
    await sendResetEmail(user.email, resetCode);

    return NextResponse.json({
      success: true,
      message: "Se o email existir, o código foi enviado.",
    });

  } catch (error) {
    console.error("Erro ao solicitar reset:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}