import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/app/lib/prisma";
import { generateToken } from "@/app/lib/auth";
import { ratelimit } from "@/app/lib/ratelimit";

export async function POST(req: Request) {
  try {
    // 🔐 Pega IP corretamente na Vercel
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0] ?? "127.0.0.1";

    // 🚫 Rate limit antes de qualquer coisa
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Muitas tentativas. Tente novamente." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email/nickname e senha são obrigatórios." },
        { status: 400 }
      );
    }

    const normalizedInput = email.toLowerCase().trim();

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedInput },
          { nickname: normalizedInput }
        ],
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Credenciais inválidas." },
        { status: 401 }
      );
    }

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

    if (!user.emailVerified) {
      return NextResponse.json(
        { error: "Email ainda não verificado." },
        { status: 403 }
      );
    }

    const token = generateToken(String(user.id));

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
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
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