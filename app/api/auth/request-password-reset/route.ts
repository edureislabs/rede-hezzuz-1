import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { Resend } from "resend";

function generateResetCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email é obrigatório." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json(
        { error: "Email não cadastrado." },
        { status: 404 }
      );
    }

    const resetCode = generateResetCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos

    await prisma.user.update({
      where: { email },
      data: {
        resetCode,
        resetCodeExpires: expiresAt,
      },
    });

    // ✅ Enviar email usando Resend
    const resend = new Resend(process.env.RESEND_API_KEY);

    const { error } = await resend.emails.send({
      from: "noreply@site.hezzuz.com",
      to: email,
      subject: "Código para alterar senha",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #f97316;">🔐 Alteração de Senha</h2>
          <p>Olá ${user.nickname},</p>
          <p>Você solicitou a alteração da sua senha na Rede Hezzuz.</p>
          <div style="background: #1f2937; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <h1 style="font-size: 32px; letter-spacing: 5px; color: #fff; margin: 0;">${resetCode}</h1>
          </div>
          <p style="color: #9ca3af;">Este código expira em 15 minutos.</p>
          <p style="color: #9ca3af;">Se não foi você, ignore este email.</p>
          <hr style="border: none; border-top: 1px solid #374151; margin: 20px 0;">
          <p style="font-size: 12px; color: #6b7280;">Rede Hezzuz</p>
        </div>
      `,
    });

    if (error) {
      console.error("Erro ao enviar reset:", error);
      throw new Error("Erro ao enviar email");
    }

    return NextResponse.json({
      success: true,
      message: "Código enviado para o email.",
    });
  } catch (error) {
    console.error("Erro ao solicitar reset:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
