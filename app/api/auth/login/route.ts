import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email ou nickname e senha são obrigatórios." },
        { status: 400 }
      );
    }

    // 🔥 BUSCA POR EMAIL OU NICKNAME
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { nickname: email } // se digitar nickname no campo
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // 🔐 Verifica senha
    const passwordValid = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordValid) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

    // ⚠️ Se você tiver verificação de email:
    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Email ainda não verificado" },
        { status: 403 }
      );
    }

    // 🍪 Criar cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
      },
    });

    response.cookies.set({
      name: "auth-token",
      value: String(user.id),
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
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
