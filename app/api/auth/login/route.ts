import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    console.log("🔐 LOGIN API CHAMADA");
    
    const body = await req.json();
    const { email, password } = body;

    console.log("📧 Email recebido:", email);

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("❌ Usuário não encontrado");
      return NextResponse.json(
        { error: "Email ou senha inválidos." },
        { status: 401 }
      );
    }

    console.log("✅ Usuário encontrado:", user.email);

    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      console.log("❌ Senha inválida");
      return NextResponse.json(
        { error: "Email ou senha inválidos." },
        { status: 401 }
      );
    }

    // Verificar email
    if (!user.emailVerified) {
      console.log("⚠️ Email não verificado");
      return NextResponse.json(
        { error: "Confirme seu email antes de entrar." },
        { status: 403 }
      );
    }

    console.log("✅ Login bem-sucedido para:", user.email);

    // Criar cookie
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
      maxAge: 60 * 60 * 24 * 7, // 7 dias
    });

    return response;
  } catch (error) {
    console.error("🔥 ERRO NO LOGIN:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}