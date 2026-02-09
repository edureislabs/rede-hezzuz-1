import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import nodemailer from "nodemailer";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
  }

  const code = generateCode();
  const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 min

  await prisma.user.update({
    where: { email },
    data: {
      verificationCode: code,
      verificationExpires: expires,
    },
  });

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Rede Hezzuz" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Código de verificação",
    html: `
      <h2>Verificação de Email</h2>
      <p>Seu código:</p>
      <h1>${code}</h1>
      <p>Expira em 15 minutos.</p>
    `,
  });

  return NextResponse.json({ success: true });
}
