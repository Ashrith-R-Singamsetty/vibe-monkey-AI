import { api, APIError } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { authDB } from "./db";

interface RevokeSessionRequest {
  sessionId: string;
}

interface RevokeSessionResponse {
  ok: boolean;
}

export const revokeSession = api<RevokeSessionRequest, RevokeSessionResponse>(
  { expose: true, method: "POST", path: "/api/auth/revoke-session", auth: true },
  async (req) => {
    const auth = getAuthData()!;
    // Verify ownership
    const s = await authDB.queryRow<{ user_id: string }>`
      SELECT user_id FROM auth.user_sessions WHERE id = ${req.sessionId}
    `;
    if (!s || s.user_id !== auth.userID) {
      throw APIError.permissionDenied("cannot revoke session");
    }

    // Revoke refresh tokens associated with user (best-effort for this session scope)
    await authDB.exec`
      UPDATE auth.refresh_tokens SET revoked = ${true}
      WHERE user_id = ${auth.userID}
    `;

    return { ok: true };
  }
);
