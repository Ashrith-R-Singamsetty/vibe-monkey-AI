export interface User {
  id: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  userId: string;
  fullName?: string | null;
  avatarUrl?: string | null;
  metadata?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SessionInfo {
  sessionId: string;
  createdAt: Date;
  lastSeen: Date | null;
  ip?: string | null;
  userAgent?: string | null;
}

export interface CurrentUser {
  id: string;
  email: string;
  emailVerified: boolean;
  profile?: {
    fullName?: string | null;
    avatarUrl?: string | null;
  } | null;
  roles: string[];
}

export interface JWTClaims {
  sub: string;        // user id
  email: string;
  roles: string[];
  iat: number;
  exp: number;
  jti: string;
}
