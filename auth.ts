import NextAuth from "next-auth";

import type { NextAuthConfig } from "next-auth";

import Credentials from "next-auth/providers/credentials";
import { validateJWT } from "@/lib/auth/authHelpers";
import { db } from "@/lib/db";
import { users, User, wallets } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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

        // userが存在しなければ作成する
        await db.insert(users)
            .values({
              sub: jwtPayload?.sub || "",
            })
            .onConflictDoNothing();
        const user = await db.query.users.findFirst({
          where: eq(users.sub, jwtPayload?.sub || ""),
        });
        if (!user) {
          throw new Error("User not found");
        }
        // userのwalletも作成する
        await db.insert(wallets)
            .values({
              userId: user?.id,
              address: jwtPayload?.verified_credentials[0].address,
              chain: jwtPayload?.verified_credentials[0].chain,
              dynamicId: jwtPayload?.verified_credentials[0].id,
            })
            .onConflictDoNothing();

        return user || null;
      },
    }),
  ],
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);