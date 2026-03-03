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
      const t = token as any;

      if (account?.access_token) t.accessToken = account.access_token;

      const p = profile as any;

      const realmRoles: string[] = p?.realm_access?.roles ?? [];
      const clientId = process.env.KEYCLOAK_CLIENT_ID || "web";
      const clientRoles: string[] = p?.resource_access?.[clientId]?.roles ?? [];

      const existing: string[] = Array.isArray(t.roles) ? t.roles : [];
      t.roles = Array.from(new Set([...existing, ...realmRoles, ...clientRoles]));

      t.condominiumId = p?.condominiumId ?? t.condominiumId;

      return t;
    },

    async session({ session, token }) {
      const t = token as any;

      (session as any).accessToken = t.accessToken;
      (session as any).roles = t.roles ?? [];
      (session as any).condominiumId = t.condominiumId;

      return session;
    },
  },
};