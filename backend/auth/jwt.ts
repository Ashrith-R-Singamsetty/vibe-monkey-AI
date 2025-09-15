import crypto from "node:crypto";
import { secret } from "encore.dev/config";
import type { JWTClaims } from "./types";

const jwtSecret = secret("JWTSecret");

function base64url(input: Buffer | string): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64urlJson(obj: any): string {
  return base64url(Buffer.from(JSON.stringify(obj)));
}

function hmacSHA256(data: string, key: string): Buffer {
  return crypto.createHmac("sha256", key).update(data).digest();
}

export function signJWT(claims: Omit<JWTClaims, "iat" | "exp" | "jti">, ttlSeconds: number): { token: string; claims: JWTClaims } {
  const header = { alg: "HS256", typ: "JWT" };
  const now = Math.floor(Date.now() / 1000);
  const jti = crypto.randomUUID();
  const fullClaims: JWTClaims = {
    ...claims,
    iat: now,
    exp: now + ttlSeconds,
    jti,
  };
  const headerB64 = base64urlJson(header);
  const payloadB64 = base64urlJson(fullClaims);
  const data = `${headerB64}.${payloadB64}`;
  const sig = hmacSHA256(data, jwtSecret());
  const token = `${data}.${base64url(sig)}`;
  return { token, claims: fullClaims };
}

export function verifyJWT(token: string): JWTClaims | null {
  try {
    const [headerB64, payloadB64, sigB64] = token.split(".");
    if (!headerB64 || !payloadB64 || !sigB64) return null;
    const headerJson = Buffer.from(headerB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    const header = JSON.parse(headerJson);
    if (header.alg !== "HS256" || header.typ !== "JWT") return null;
    const expected = base64url(hmacSHA256(`${headerB64}.${payloadB64}`, jwtSecret()));
    if (expected !== sigB64) return null;
    const payloadJson = Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8");
    const claims: JWTClaims = JSON.parse(payloadJson);
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp < now) return null;
    return claims;
  } catch {
    return null;
  }
}
