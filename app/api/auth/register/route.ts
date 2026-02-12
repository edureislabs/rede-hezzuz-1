import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nickname, password } = body; // MUDOU: removeu email

    if (!nickname || !password) {
      return NextResponse.json(
        { error: "Nickname e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // Verifica se nickname já existe
    const existingUser = await prisma.user.findFirst({
      where: { nickname },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Nickname já está em uso." },
        { status: 409 }
      );
    }

    // Hash da senha
    const passwordHash = await bcrypt.hash(password, 10);

    // Cria usuário
    const user = await prisma.user.create({
      data: {
        nickname,
        passwordHash,
      },
    });

    // Cria cookie automaticamente após registro
    const response = NextResponse.json({
      success: true,
      message: "Conta criada com sucesso!",
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
    console.error("Erro no registro:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}