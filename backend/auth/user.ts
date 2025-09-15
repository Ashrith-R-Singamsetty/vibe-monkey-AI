import { api } from "encore.dev/api";
import { getAuthData } from "~encore/auth";
import { authDB } from "./db";
import type { CurrentUser } from "./types";

export const getUser = api<void, CurrentUser>(
  { expose: true, method: "GET", path: "/api/auth/user", auth: true },
  async () => {
    const auth = getAuthData()!;
    const profile = await authDB.queryRow<{ full_name: string | null; avatar_url: string | null }>`
      SELECT full_name, avatar_url FROM public.user_profiles WHERE user_id = ${auth.userID}
    `;
    return {
      id: auth.userID,
      email: auth.email,
      emailVerified: true,
      profile: {
        fullName: profile?.full_name ?? null,
        avatarUrl: profile?.avatar_url ?? null,
      },
      roles: auth.roles,
    };
  }
);
