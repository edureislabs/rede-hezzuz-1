import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";
import { sendVerificationEmail } from "../../../lib/email";

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { nickname, email, password } = body;

    if (!nickname || !email || !password) {
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      );
    }

    const emailExists = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExists) {
      return NextResponse.json(
        { error: "Email já cadastrado." },
        { status: 409 }
      );
    }

    const nickExists = await prisma.user.findFirst({
      where: { nickname },
    });

    if (nickExists) {
      return NextResponse.json(
        { error: "Nickname já está em uso." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const verificationCode = generateVerificationCode();

    await prisma.user.create({
      data: {
        nickname,
        email,
        passwordHash,
        verificationCode,
        emailVerified: false,
      },
    });

    // 🔥 ENVIA EMAIL AQUI
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json(
      {
        success: true,
        message: "Conta criada. Verifique seu email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}