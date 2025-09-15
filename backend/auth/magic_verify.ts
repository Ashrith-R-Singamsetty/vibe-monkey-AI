import { api, APIError, Cookie, Query } from "encore.dev/api";
import { authDB } from "./db";
import { accessCookie, refreshCookie } from "./cookies";
import { generateToken, hashRefreshToken } from "./utils";
import { signJWT } from "./jwt";

interface MagicVerifyParams {
  token: Query<string>;
}

interface MagicVerifyResponse {
  ok: boolean;
  message: string;
  redirectTo: string;
  access_token: Cookie<"access_token">;
  refresh_token: Cookie<"refresh_token">;
}

export const magicVerify = api<MagicVerifyParams, MagicVerifyResponse>(
  { expose: true, method: "GET", path: "/api/auth/magic/verify" },
  async (req) => {
    const ml = await authDB.queryRow<{
      token: string;
      email: string;
      expires_at: Date;
      consumed: boolean;
      redirect_to: string | null;
    }>`SELECT token, email, expires_at, consumed, redirect_to FROM auth.magic_links WHERE token = ${req.token}`;

    if (!ml) throw APIError.notFound("invalid token");
    if (ml.consumed) throw APIError.failedPrecondition("token already used");
    if (ml.expires_at < new Date()) throw APIError.failedPrecondition("token expired");

    // Upsert user if not exists (passwordless)
    const email = ml.email.toLowerCase();
    let user = await authDB.queryRow<{ id: string }>`SELECT id FROM auth.users WHERE email = ${email}`;
    if (!user) {
      user = await authDB.queryRow<{ id: string }>`
        INSERT INTO auth.users (email, email_verified)
        VALUES (${email}, ${true})
        RETURNING id
      `;
      await authDB.exec`
        INSERT INTO public.user_profiles (user_id) VALUES (${user!.id})
      `;
      await authDB.exec`
        INSERT INTO public.user_roles (user_id, role_name) VALUES (${user!.id}, ${"user"})
      `;
    } else {
      await authDB.exec`
        UPDATE auth.users SET email_verified = ${true} WHERE id = ${user.id}
      `;
    }

    await authDB.exec`
      UPDATE auth.magic_links SET consumed = ${true} WHERE token = ${req.token}
    `;

    // roles
    const roles = await authDB.queryAll<{ role_name: string }>`
      SELECT role_name FROM public.user_roles WHERE user_id = ${user!.id}
    `;
    const roleNames = roles.map(r => r.role_name);

    const { token: access } = signJWT({ sub: user!.id, email, roles: roleNames }, 15 * 60);
    const rawRefresh = generateToken(32);
    const hashed = hashRefreshToken(rawRefresh);
    const refreshExp = new Date(Date.now() + 30 * 24 * 3600 * 1000);

    await authDB.exec`
      INSERT INTO auth.refresh_tokens (user_id, hashed_token, expires_at)
      VALUES (${user!.id}, ${hashed}, ${refreshExp})
    `;

    return {
      ok: true,
      message: "Sign-in successful",
      redirectTo: ml.redirect_to ?? "/",
      access_token: accessCookie(access),
      refresh_token: refreshCookie(rawRefresh),
    };
  }
);
