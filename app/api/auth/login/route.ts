import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const runtime = "nodejs";
export async function POST(req: Request) {
  const { email, password } = await req.json();

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 }
    );
  }

  const passwordMatch = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatch) {
    return NextResponse.json(
      { error: "Senha incorreta" },
      { status: 401 }
    );
  }

const token = jwt.sign(
  { id: user.id },
  process.env.JWT_SECRET!,
  { expiresIn: "7d" }
);
const response = NextResponse.json({ token });

response.cookies.set("auth-token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  path: "/",
});

return response;
return NextResponse.json({ token });
}