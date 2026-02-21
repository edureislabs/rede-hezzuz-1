import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const cookie = req.headers.get("cookie");

  if (!cookie) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const match = cookie.match(/session=(\d+)/);

  if (!match) {
    return NextResponse.json({ error: "Sessão inválida" }, { status: 401 });
  }

  const userId = Number(match[1]);

  const user = await prisma.user.findUnique({
    where: { id: userId },
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
}