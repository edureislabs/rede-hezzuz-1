import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Dados incompletos." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        resetCode: true,
        resetCodeExpires: true,
      },
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

    if (user.resetCodeExpires && new Date() > user.resetCodeExpires) {
      return NextResponse.json(
        { error: "Código expirado. Solicite um novo." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Código verificado com sucesso.",
    });
  } catch (error) {
    console.error("Erro ao verificar código:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}