import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken?.value) {
      return NextResponse.json({ user: null });
    }

    const userId = parseInt(authToken.value);
    
    if (isNaN(userId)) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Erro na API /me:", error);
    return NextResponse.json({ user: null });
  }
}