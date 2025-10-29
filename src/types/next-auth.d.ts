import NextAuth from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
    backendToken?: string;
    role?: number; // 1 = admin, 2 = user
    profile?: any;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    token?: string;
    role?: number; // 1 = admin, 2 = user
    profile?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    jti?: string;
    backendToken?: string;
    role?: number; // 1 = admin, 2 = user
    profile?: any;
  }
}
