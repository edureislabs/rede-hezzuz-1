import { NextResponse } from "next/server";
async function handleLogout() {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include"
  });
  window.location.reload();
}
export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set("session", "", {
    path: "/",
    maxAge: 0,
  });

  return response;
}