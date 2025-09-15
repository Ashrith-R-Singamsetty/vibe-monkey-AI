import { api, APIError, Cookie } from "encore.dev/api";
import { authDB } from "./db";
import { hashPassword, generateToken, hashRefreshToken } from "./utils";
import { signJWT } from "./jwt";
import { accessCookie, refreshCookie } from "./cookies";
import { sendMagicLinkEmail } from "./email";

interface SignupRequest {
  email: string;
  name?: string;
  password?: string;
  method?: "magic" | "password";
  redirectTo?: string;
}

interface SignupResponse {
  ok: boolean;
  userId?: string;
  access_token?: Cookie<"access_token">;
  refresh_token?: Cookie<"refresh_token">;
}

export const signup = api<SignupRequest, SignupResponse>(
  { expose: true, method: "POST", path: "/api/auth/signup" },
  async (req) => {
    const email = req.email.trim().toLowerCase();
    const method = req.method ?? (req.password ? "password" : "magic");

    const existing = await authDB.queryRow<{ id: string }>`SELECT id FROM auth.users WHERE email = ${email}`;
    if (existing) {
      throw APIError.alreadyExists("user already exists");
    }

    if (method === "magic") {
      // Create magic link token
      const token = generateToken(32);
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min
      const redirect = req.redirectTo ?? "/";
      await authDB.exec`
        INSERT INTO auth.magic_links (token, email, expires_at, redirect_to)
        VALUES (${token}, ${email}, ${expiresAt}, ${redirect})
      `;
      const magicUrl = `${process.env["ENCORE_APP_URL"] ?? ""}/api/auth/magic/verify?token=${encodeURIComponent(token)}`;
      await sendMagicLinkEmail(email, magicUrl);
      return { ok: true };
    }

    if (!req.password) {
      throw APIError.invalidArgument("password required for method=password");
    }

    const pwHash = await hashPassword(req.password);
    // Create user
    const user = await authDB.queryRow<{ id: string }>`
      INSERT INTO auth.users (email, password_hash, email_verified)
      VALUES (${email}, ${pwHash}, ${false})
      RETURNING id
    `;
    if (!user) throw APIError.internal("failed to create user");

    // Create profile
    await authDB.exec`
      INSERT INTO public.user_profiles (user_id, full_name)
      VALUES (${user.id}, ${req.name ?? null})
    `;

    // Grant 'user' role
    await authDB.exec`
      INSERT INTO public.user_roles (user_id, role_name)
      VALUES (${user.id}, ${"user"})
    `;

    // Create session: access + refresh tokens
    const { token: access } = signJWT({ sub: user.id, email, roles: ["user"] }, 15 * 60);
    const rawRefresh = generateToken(32);
    const hashed = hashRefreshToken(rawRefresh);
    const refreshExp = new Date(Date.now() + 30 * 24 * 3600 * 1000);

    await authDB.exec`
      INSERT INTO auth.refresh_tokens (user_id, hashed_token, expires_at)
      VALUES (${user.id}, ${hashed}, ${refreshExp})
    `;

    // Record session audit (best-effort)
    await authDB.exec`
      INSERT INTO auth.user_sessions (user_id, ip, user_agent)
      VALUES (${user.id}, ${null}, ${null})
    `;

    return {
      ok: true,
      userId: user.id,
      access_token: accessCookie(access),
      refresh_token: refreshCookie(rawRefresh),
    };
  }
);
