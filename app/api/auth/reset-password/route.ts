import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json(
        { error: "Dados incompletos." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "A senha deve ter pelo menos 6 caracteres." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    if (!user.resetCode || user.resetCode !== code) {
      return NextResponse.json(
        { error: "Código inválido." },
        { status: 400 }
      );
    }

    if (user.resetExpires && new Date() > user.resetExpires) {
      return NextResponse.json(
        { error: "Código expirado. Solicite um novo." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.updateMany({
      where: { email },
      data: {
        passwordHash,
        resetCode: null,
        resetExpires: null,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Senha alterada com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao resetar senha:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}