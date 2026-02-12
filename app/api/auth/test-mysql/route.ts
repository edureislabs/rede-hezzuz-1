import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  try {
    // Teste simples
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    
    // Tenta criar tabela se não existir
    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS User (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nickname VARCHAR(255) UNIQUE NOT NULL,
          passwordHash VARCHAR(255) NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `;
    } catch (e) {
      console.log("Tabela já existe ou erro:", e);
    }
    
    return NextResponse.json({
      success: true,
      message: "✅ Conexão MySQL estabelecida!",
      testQuery: result,
      timestamp: new Date().toISOString(),
      host: "sp-17.magnohost.com.br",
      database: "s4278_site"
    });
  } catch (error: any) {
    console.error("❌ Erro MySQL:", error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      errorCode: error.code,
      tip: "Verifique: 1) Permissões do usuário 2) Acesso remoto habilitado 3) Senha URL-encoded",
      yourConnection: "mysql://u4278_v0NdMXmPYq:*****@sp-17.magnohost.com.br:3306/s4278_site"
    }, { status: 500 });
  }
}