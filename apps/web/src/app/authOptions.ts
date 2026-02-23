import type { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      issuer: process.env.KEYCLOAK_ISSUER,
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account?.access_token) (token as any).accessToken = account.access_token;

      const anyProfile = profile as any;
      (token as any).roles = anyProfile?.realm_access?.roles ?? (token as any).roles ?? [];

      (token as any).condominiumId = anyProfile?.condominiumId ?? (token as any).condominiumId;
      (token as any).unitId = anyProfile?.unitId ?? (token as any).unitId;

      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = (token as any).accessToken;
      (session as any).roles = (token as any).roles;
      (session as any).condominiumId = (token as any).condominiumId;
      (session as any).unitId = (token as any).unitId;
      return session;
    },
  },
};