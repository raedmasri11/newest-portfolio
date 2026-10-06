import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminSessionToken, isAdminConfigured, verifyAdminPassword } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json({ error: "Admin login is not configured yet. Add ADMIN_PASSWORD and ADMIN_SESSION_SECRET in Netlify." }, { status: 503 });
  }

  const body = await request.json().catch(() => ({})) as { password?: string };
  if (!body.password || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: "Incorrect password." }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE, adminSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
