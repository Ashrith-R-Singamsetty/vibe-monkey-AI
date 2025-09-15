import { api, Cookie, APIError } from "encore.dev/api";
import { authDB } from "./db";
import { refreshCookie, accessCookie } from "./cookies";
import { hashRefreshToken, generateToken } from "./utils";
import { signJWT } from "./jwt";

interface RefreshParams {
  refresh?: Cookie<"refresh_token">;
}

interface RefreshResponse {
  ok: boolean;
  access_token: Cookie<"access_token">;
  refresh_token: Cookie<"refresh_token">;
}

export const refresh = api<RefreshParams, RefreshResponse>(
  { expose: true, method: "POST", path: "/api/auth/refresh" },
  async (req) => {
    const raw = req.refresh?.value;
    if (!raw) throw APIError.unauthenticated("missing refresh token");

    const hashed = hashRefreshToken(raw);

    const row = await authDB.queryRow<{
      id: string;
      user_id: string;
      expires_at: Date;
      revoked: boolean;
    }>`
      SELECT id, user_id, expires_at, revoked
      FROM auth.refresh_tokens
      WHERE hashed_token = ${hashed}
    `;

    if (!row) throw APIError.unauthenticated("invalid refresh token");
    if (row.revoked || row.expires_at < new Date()) {
      throw APIError.unauthenticated("refresh token expired or revoked");
    }

    // Rotate: revoke old, issue new
    await authDB.exec`
      UPDATE auth.refresh_tokens SET revoked = ${true} WHERE id = ${row.id}
    `;

    const newRaw = generateToken(32);
    const newHash = hashRefreshToken(newRaw);
    const refreshExp = new Date(Date.now() + 30 * 24 * 3600 * 1000);

    const userEmailRow = await authDB.queryRow<{ email: string }>`
      SELECT email FROM auth.users WHERE id = ${row.user_id}
    `;
    const roles = await authDB.queryAll<{ role_name: string }>`
      SELECT role_name FROM public.user_roles WHERE user_id = ${row.user_id}
    `;
    const roleNames = roles.map(r => r.role_name);

    await authDB.exec`
      INSERT INTO auth.refresh_tokens (user_id, hashed_token, expires_at)
      VALUES (${row.user_id}, ${newHash}, ${refreshExp})
    `;

    const { token } = signJWT({ sub: row.user_id, email: userEmailRow!.email, roles: roleNames }, 15 * 60);

    return {
      ok: true,
      access_token: accessCookie(token),
      refresh_token: refreshCookie(newRaw),
    };
  }
);
