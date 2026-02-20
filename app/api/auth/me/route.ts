import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { verifyToken } from "../../../lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authToken = cookieStore.get("auth-token");

    if (!authToken?.value) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = verifyToken(authToken.value);

    if (!decoded) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // ✅ CONVERTE PARA NUMBER
    const userId = Number(decoded.userId);

    if (isNaN(userId)) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        email: true,
      },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error("🔥 ERRO na API /me:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}