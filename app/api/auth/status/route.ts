import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const userCount = await prisma.user.count();
  
  return NextResponse.json({
    status: "online",
    database: "MySQL MagnoHost",
    users: userCount,
    timestamp: new Date().toISOString()
  });
}