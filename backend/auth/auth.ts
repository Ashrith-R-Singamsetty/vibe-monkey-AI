import { Header, Cookie, APIError, Gateway } from "encore.dev/api";
import { authHandler } from "encore.dev/auth";
import { verifyJWT } from "./jwt";

interface AuthParams {
  authorization?: Header<"Authorization">;
  accessToken?: Cookie<"access_token">;
}

export interface AuthData {
  userID: string;
  email: string;
  roles: string[];
}

export const auth = authHandler<AuthParams, AuthData>(async (req) => {
  // Read token from Authorization Bearer or HttpOnly cookie
  const bearer = req.authorization?.startsWith("Bearer ") ? req.authorization.slice(7) : undefined;
  const token = bearer ?? req.accessToken?.value;
  if (!token) {
    throw APIError.unauthenticated("missing access token");
  }
  const claims = verifyJWT(token);
  if (!claims) {
    throw APIError.unauthenticated("invalid or expired token");
  }
  return {
    userID: claims.sub,
    email: claims.email,
    roles: claims.roles,
  };
});

// Global API Gateway config
export const gw = new Gateway({ authHandler: auth });
