import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { sendVerificationEmail } from "../../../lib/email";
import crypto from "crypto";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  if (user.emailVerified) {
    return NextResponse.json({ message: "Email já verificado" });
  }

  const code = crypto.randomInt(100000, 999999).toString();
  const expires = new Date(Date.now() + 15 * 60 * 1000);

  await prisma.user.update({
    where: { email },
    data: {
      verificationCode: code,
      verificationExpires: expires,
    },
  });

  await sendVerificationEmail(email, code);

  return NextResponse.json({ message: "Código reenviado com sucesso" });
}