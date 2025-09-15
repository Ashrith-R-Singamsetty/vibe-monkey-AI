import type { Cookie } from "encore.dev/api";

export function accessCookie(token: string, maxAgeSec = 15 * 60): Cookie&lt;"access_token"&gt; {
  return {
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: maxAgeSec,
  };
}

export function refreshCookie(token: string, maxAgeSec = 60 * 60 * 24 * 30): Cookie&lt;"refresh_token"&gt; {
  return {
    value: token,
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    // Scope refresh cookie to refresh endpoint path to minimize leakage
    path: "/api/auth/refresh",
    maxAge: maxAgeSec,
  };
}

export function clearAccessCookie(): Cookie&lt;"access_token"&gt; {
  return {
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 0,
  };
}

export function clearRefreshCookie(): Cookie&lt;"refresh_token"&gt; {
  return {
    value: "",
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    path: "/api/auth/refresh",
    maxAge: 0,
  };
}
