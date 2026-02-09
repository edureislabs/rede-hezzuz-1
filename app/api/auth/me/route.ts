import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    // ❌ ANTES: session.value
    // ✅ AGORA: auth-token.value
    const authToken = cookieStore.get("auth-token");

    console.log("🔍 Cookie auth-token encontrado?", !!authToken);
    console.log("🔍 Valor do cookie:", authToken?.value);

    if (!authToken || !authToken.value) {
      console.log("❌ Nenhum token encontrado");
      return NextResponse.json({ user: null });
    }

    const userId = parseInt(authToken.value);
    
    if (isNaN(userId)) {
      console.log("❌ ID do usuário inválido:", authToken.value);
      return NextResponse.json({ user: null });
    }

    console.log("🔍 Buscando usuário ID:", userId);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nickname: true,
        email: true,
      },
    });

    console.log("👤 Usuário encontrado:", user ? "SIM" : "NÃO");

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("🔥 ERRO na API /me:", error);
    return NextResponse.json({ user: null });
  }
}