import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import jwt from "jsonwebtoken";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ error: "Token não fornecido" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,  
      process.env.JWT_SECRET!
    ) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        nickname: true,
        email: true,
      },
    });

    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "Token inválido" }, { status: 401 });
  }
}