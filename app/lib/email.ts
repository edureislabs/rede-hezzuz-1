import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendVerificationEmail(email: string, code: string) {
  await resend.emails.send({
    from: "noreply@site.hezzuz.com",
    to: email,
    subject: "Verifique seu email",
    html: `<p>Seu código é: <strong>${code}</strong></p>`
  });
}

export async function sendResetEmail(email: string, code: string) {
  await resend.emails.send({
    from: "noreply@site.hezzuz.com",
    to: email,
    subject: "Redefinição de senha",
    html: `<p>Seu código de redefinição é: <strong>${code}</strong></p>`
  });
}