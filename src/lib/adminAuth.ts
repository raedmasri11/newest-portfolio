import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "raed_admin_session";

function env(name: string) {
  return process.env[name]?.trim() ?? "";
}

export function isAdminConfigured() {
  return env("ADMIN_PASSWORD").length >= 8 && env("ADMIN_SESSION_SECRET").length >= 32;
}

function expectedToken() {
  const secret = env("ADMIN_SESSION_SECRET");
  if (!secret) return "";
  return createHmac("sha256", secret).update("raed-portfolio-admin-v1").digest("hex");
}

export function verifyAdminPassword(value: string) {
  const expected = Buffer.from(env("ADMIN_PASSWORD"));
  const provided = Buffer.from(value);
  if (!expected.length || expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
}

export async function isAdminAuthenticated() {
  if (!isAdminConfigured()) return false;
  const cookieStore = await cookies();
  const provided = cookieStore.get(ADMIN_COOKIE)?.value ?? "";
  const expected = expectedToken();
  if (!provided || provided.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

export function adminSessionToken() {
  return expectedToken();
}
