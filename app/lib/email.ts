import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(
  email: string,
  code: string
) {
  console.log("📧 Enviando email para:", email);
  console.log("🔑 Código:", code);

  const { error } = await resend.emails.send({
    from: "noreply@site.hezzuz.com", // enquanto não verificar domínio
    to: email,
    subject: "Confirme seu email - Rede Hezzuz",
    html: `
      <div style="font-family: Arial; padding: 20px">
        <h2>Confirmação de Email</h2>
        <p>Seu código de verificação é:</p>
        <h1 style="letter-spacing: 4px">${code}</h1>
        <p>Digite esse código no site para ativar sua conta.</p>
      </div>
    `,
  });

  if (error) {
    console.error("❌ Erro ao enviar email:", error);
    throw new Error("Erro ao enviar email");
  }

  console.log("✅ Email enviado com sucesso");
}
