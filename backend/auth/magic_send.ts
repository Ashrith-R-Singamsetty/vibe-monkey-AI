import { api } from "encore.dev/api";
import { authDB } from "./db";
import { generateToken } from "./utils";
import { sendMagicLinkEmail } from "./email";

interface MagicSendRequest {
  email: string;
  redirectTo?: string;
}

interface MagicSendResponse {
  ok: boolean;
}

export const magicSend = api&lt;MagicSendRequest, MagicSendResponse&gt;(
  { expose: true, method: "POST", path: "/api/auth/magic/send" },
  async (req) =&gt; {
    const email = req.email.trim().toLowerCase();
    const token = generateToken(32);
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const redirect = req.redirectTo ?? "/";

    await authDB.exec`
      INSERT INTO auth.magic_links (token, email, expires_at, redirect_to)
      VALUES (${token}, ${email}, ${expiresAt}, ${redirect})
    `;

    const magicUrl = `${process.env["ENCORE_APP_URL"] ?? ""}/api/auth/magic/verify?token=${encodeURIComponent(token)}`;
    await sendMagicLinkEmail(email, magicUrl);
    return { ok: true };
  }
);
