export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie");

  if (!cookie) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const token = cookie
    .split("; ")
    .find(c => c.startsWith("auth-token="))
    ?.split("=")[1];

  if (!token) {
    return NextResponse.json({ error: "Token ausente" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as { id: number };

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        nickname: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}