import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "../../../lib/prisma";

function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req: Request) {
  console.log("=== REGISTER ENDPOINT CALLED ===");
  
  try {
    // 1. Parse do body
    console.log("Parsing request body...");
    const body = await req.json();
    const { nickname, email, password } = body;
    
    console.log("Data received:", { 
      nickname, 
      email, 
      password: password ? "***" : "missing" 
    });

    // 2. Validação básica
    if (!nickname || !email || !password) {
      console.log("Validation failed - missing fields");
      return NextResponse.json(
        { error: "Dados inválidos." },
        { status: 400 }
      );
    }

    // 3. Verificar email existente
    console.log(`Checking if email exists: ${email}`);
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExists) {
      console.log("Email already registered");
      return NextResponse.json(
        { error: "Email já cadastrado." },
        { status: 409 }
      );
    }

    // 4. Verificar nickname existente
    console.log(`Checking if nickname exists: ${nickname}`);
    const nickExists = await prisma.user.findFirst({
      where: { nickname },
    });

    if (nickExists) {
      console.log("Nickname already in use");
      return NextResponse.json(
        { error: "Nickname já está em uso." },
        { status: 409 }
      );
    }

    // 5. Hash da senha
    console.log("Hashing password...");
    let passwordHash;
    try {
      passwordHash = await bcrypt.hash(password, 10);
      console.log("Password hashed successfully");
    } catch (hashError: any) {
      console.error("Bcrypt hash error:", hashError);
      return NextResponse.json(
        { error: "Erro ao processar senha." },
        { status: 500 }
      );
    }

    // 6. Gerar código de verificação
    const verificationCode = generateVerificationCode();
    console.log(`Generated verification code: ${verificationCode}`);

    // 7. Criar usuário NO BANCO (MOMENTO CRÍTICO!)
    console.log("Creating user in database...");
    
    
    
    const newUser = await prisma.user.create({
      data: {
        nickname,
        email,
        passwordHash,
        verificationCode,
        emailVerified: false,
        // ⚠️ ADICIONE ESTA LINHA SE O CAMPO EXISTIR NO SCHEMA:
        // verificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
    
    console.log("User created successfully:", { 
      id: newUser.id, 
      email: newUser.email,
      nickname: newUser.nickname 
    });

    // 8. Enviar email (com fallback)
    console.log("Sending verification email...");
    try {
      // Chama a função de email
      // await sendVerificationEmail(email, verificationCode);
      console.log(`[DEV] Email would be sent to ${email} with code: ${verificationCode}`);
    } catch (emailError: any) {
      console.error("Email sending failed:", emailError);
      // Continua mesmo se o email falhar
    }

    console.log("=== REGISTER SUCCESS ===");
    
    return NextResponse.json(
      {
        success: true,
        message: "Conta criada com sucesso! Verifique seu email.",
        userId: newUser.id,
      },
      { status: 201 }
    );

  } catch (error: any) {
    // LOG DETALHADO DO ERRO
    console.error("=== REGISTER ERROR ===");
    console.error("Error message:", error.message);
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);
    console.error("Full error:", error);
    
    // Erro específico do Prisma
    if (error.code) {
      console.error("Prisma error code:", error.code);
      
      if (error.code === 'P2002') {
        return NextResponse.json(
          { error: "Email ou nickname já cadastrado." },
          { status: 409 }
        );
      }
      
      if (error.code === 'P1001') {
        return NextResponse.json(
          { error: "Não foi possível conectar ao banco de dados." },
          { status: 500 }
        );
      }
    }

    // Erro genérico
    return NextResponse.json(
      { 
        error: "Erro interno do servidor.",
        // Mostra detalhes apenas em dev
        ...(process.env.NODE_ENV === 'development' && { 
          details: error.message,
          code: error.code 
        })
      },
      { status: 500 }
    );
  }
}