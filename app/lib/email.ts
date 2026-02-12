import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendVerificationEmail(
  email: string,
  code: string
) {
  console.log("📧 Enviando email para:", email);
  console.log("🔑 Código:", code);

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
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

  console.log("✅ Email enviado com sucesso");
}