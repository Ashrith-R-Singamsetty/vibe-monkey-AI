import crypto from "node:crypto";
import { secret } from "encore.dev/config";

const refreshSecret = secret("RefreshSecret");

/**
 * Hash a password using scrypt with a random salt.
 * Stored format: scrypt$N$r$p$salt$hash
 */
export async function hashPassword(password: string): Promise<string> {
  const N = 16384;
  const r = 8;
  const p = 1;
  const salt = crypto.randomBytes(16);
  const derivedKey = await scryptAsync(password, salt, 64, { N, r, p });
  return [
    "scrypt",
    N.toString(),
    r.toString(),
    p.toString(),
    salt.toString("base64"),
    Buffer.from(derivedKey).toString("base64"),
  ].join("$");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const [algo, nStr, rStr, pStr, saltB64, hashB64] = stored.split("$");
    if (algo !== "scrypt") return false;
    const N = parseInt(nStr, 10);
    const r = parseInt(rStr, 10);
    const p = parseInt(pStr, 10);
    const salt = Buffer.from(saltB64, "base64");
    const expected = Buffer.from(hashB64, "base64");
    const derivedKey = await scryptAsync(password, salt, expected.length, { N, r, p });
    return crypto.timingSafeEqual(expected, Buffer.from(derivedKey));
  } catch {
    return false;
  }
}

/**
 * Generate a secure random token (base64url)
 */
export function generateToken(bytes = 32): string {
  return crypto.randomBytes(bytes).toString("base64url");
}

/**
 * Hash refresh token with server-side secret for DB storage
 */
export function hashRefreshToken(token: string): string {
  const h = crypto.createHmac("sha256", refreshSecret()).update(token).digest("hex");
  return h;
}

function scryptAsync(password: string, salt: Buffer, keylen: number, opts: { N: number; r: number; p: number; }): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, keylen, opts, (err, derivedKey) => {
      if (err) reject(err);
      else resolve(derivedKey as Buffer);
    });
  });
}
