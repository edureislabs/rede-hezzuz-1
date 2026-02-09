import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  response.cookies.set({
    name: "auth-token",
    value: "",
    maxAge: 0, // Expira imediatamente
    path: "/",
  });

  return response;
}