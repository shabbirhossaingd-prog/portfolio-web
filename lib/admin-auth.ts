import crypto from "node:crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE = "portfolio_admin";
const SESSION_HOURS = 12;

function adminEmail() {
  return (process.env.ADMIN_EMAIL || "designerazhaf@gmail.com").trim().toLowerCase();
}

function passwordSecret() {
  return process.env.ADMIN_PASSWORD || "";
}

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || passwordSecret();
}

function digest(value: string) {
  return crypto.createHash("sha256").update(value).digest();
}

function safeEqual(a: string, b: string) {
  return crypto.timingSafeEqual(digest(a), digest(b));
}

function sign(value: string) {
  const secret = sessionSecret();
  if (!secret) throw new Error("Admin session secret is not configured.");
  return crypto.createHmac("sha256", secret).update(value).digest("base64url");
}

export function hasAdminConfig() {
  return Boolean(passwordSecret() && sessionSecret());
}

export function validateAdminLogin(email: string, password: string) {
  const expectedPassword = passwordSecret();
  if (!expectedPassword) return false;

  return safeEqual(email.trim().toLowerCase(), adminEmail()) && safeEqual(password, expectedPassword);
}

export function createAdminToken() {
  const payload = Buffer.from(
    JSON.stringify({
      email: adminEmail(),
      exp: Date.now() + SESSION_HOURS * 60 * 60 * 1000,
    }),
    "utf8",
  ).toString("base64url");

  return payload + "." + sign(payload);
}

export function verifyAdminToken(token?: string | null) {
  if (!token) return false;

  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature || !safeEqual(signature, sign(payload))) return false;

    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      email?: string;
      exp?: number;
    };

    return data.email === adminEmail() && typeof data.exp === "number" && data.exp > Date.now();
  } catch {
    return false;
  }
}

export function isAdminRequest(request: NextRequest) {
  return verifyAdminToken(request.cookies.get(ADMIN_COOKIE)?.value);
}

export function adminCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_HOURS * 60 * 60,
  };
}
