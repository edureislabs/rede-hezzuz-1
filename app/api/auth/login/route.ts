import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nickname, password } = body;

    if (!nickname || !password) {
      return NextResponse.json(
        { error: "Nickname e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // Busca por nickname
    const user = await prisma.user.findFirst({
      where: { nickname },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Nickname ou senha inválidos." },
        { status: 401 }
      );
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Nickname ou senha inválidos." },
        { status: 401 }
      );
    }

    // Criar cookie de sessão
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nickname: user.nickname,
      },
    });

    response.cookies.set({
      name: "auth-token",
      value: String(user.id),
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error) {
    console.error("Erro no login:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}