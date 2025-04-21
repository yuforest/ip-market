import NextAuth from "next-auth";

import type { NextAuthConfig } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { validateJWT } from "./lib/auth/authHelpers";

type User = {
  id: string;
  address: string;
  addresses: string[];
  sub: string;
};

export const config = {
  theme: {
    logo: "https://next-auth.js.org/img/logo/logo-sm.png",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(
        credentials: Partial<Record<"token", unknown>>,
        request: Request
      ): Promise<User | null> {
        const token = credentials.token as string; // Safely cast to string; ensure to handle undefined case
        if (typeof token !== "string" || !token) {
          throw new Error("Token is required");
        }

        const jwtPayload = await validateJWT(token);
        console.log(`jwtPayload: ${jwtPayload?.sub}`)
        console.log(`jwtPayload: ${jwtPayload?.iat}`)
        console.log(`jwtPayload: ${jwtPayload?.verified_credentials[0]?.address}`)

        if (jwtPayload) {
          // Transform the JWT payload into your user object
          const user: User = {
            id: jwtPayload.sub || "",
            address: "test",
            addresses: jwtPayload.verified_credentials.map((credential: any) => credential.address),
            sub: jwtPayload.sub,
          };
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);