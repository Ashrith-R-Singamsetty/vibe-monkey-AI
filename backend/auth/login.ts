import { api, APIError, Cookie } from "encore.dev/api";
import { authDB } from "./db";
import { verifyPassword, generateToken, hashRefreshToken } from "./utils";
import { signJWT } from "./jwt";
import { accessCookie, refreshCookie } from "./cookies";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  ok: boolean;
  access_token: Cookie<"access_token">;
  refresh_token: Cookie<"refresh_token">;
}

export const login = api<LoginRequest, LoginResponse>(
  { expose: true, method: "POST", path: "/api/auth/login" },
  async (req) => {
    const email = req.email.trim().toLowerCase();

    const user = await authDB.queryRow<{ id: string; password_hash: string | null }>`
      SELECT id, password_hash FROM auth.users WHERE email = ${email}
    `;
    if (!user || !user.password_hash) {
      // don't reveal which was incorrect
      throw APIError.permissionDenied("invalid credentials");
    }
    const ok = await verifyPassword(req.password, user.password_hash);
    if (!ok) {
      throw APIError.permissionDenied("invalid credentials");
    }

    // Get roles
    const roles = await authDB.queryAll<{ role_name: string }>`
      SELECT role_name FROM public.user_roles WHERE user_id = ${user.id}
    `;
    const roleNames = roles.map(r => r.role_name);

    const { token: access } = signJWT({ sub: user.id, email, roles: roleNames }, 15 * 60);
    const rawRefresh = generateToken(32);
    const hashed = hashRefreshToken(rawRefresh);
    const refreshExp = new Date(Date.now() + 30 * 24 * 3600 * 1000);

    await authDB.exec`
      INSERT INTO auth.refresh_tokens (user_id, hashed_token, expires_at)
      VALUES (${user.id}, ${hashed}, ${refreshExp})
    `;

    await authDB.exec`
      INSERT INTO auth.user_sessions (user_id, ip, user_agent)
      VALUES (${user.id}, ${null}, ${null})
    `;

    return {
      ok: true,
      access_token: accessCookie(access),
      refresh_token: refreshCookie(rawRefresh),
    };
  }
);
