import { api, Cookie } from "encore.dev/api";
import { authDB } from "./db";
import { clearAccessCookie, clearRefreshCookie } from "./cookies";
import { hashRefreshToken } from "./utils";

interface LogoutRequest {
  refresh?: Cookie<"refresh_token">;
}

interface LogoutResponse {
  ok: boolean;
  access_token: Cookie<"access_token">;
  refresh_token: Cookie<"refresh_token">;
}

export const logout = api<LogoutRequest, LogoutResponse>(
  { expose: true, method: "POST", path: "/api/auth/logout" },
  async (req) => {
    const raw = req.refresh?.value;
    if (raw) {
      const hashed = hashRefreshToken(raw);
      await authDB.exec`
        UPDATE auth.refresh_tokens SET revoked = ${true}
        WHERE hashed_token = ${hashed}
      `;
    }
    return {
      ok: true,
      access_token: clearAccessCookie(),
      refresh_token: clearRefreshCookie(),
    };
  }
);
