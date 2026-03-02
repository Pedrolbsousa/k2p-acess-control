import type { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

function decodeJwtPayload(token: string) {
  const part = token.split(".")[1];
  const padded = part.replace(/-/g, "+").replace(/_/g, "/");
  const json = Buffer.from(padded, "base64").toString("utf8");
  return JSON.parse(json);
}

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      issuer: process.env.KEYCLOAK_ISSUER,
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account?.access_token) {
        token.accessToken = account.access_token;

        const decoded: any = decodeJwtPayload(account.access_token as string);

        const realmRoles: string[] = decoded?.realm_access?.roles ?? [];
        const clientId = process.env.KEYCLOAK_CLIENT_ID || "web";
        const clientRoles: string[] = decoded?.resource_access?.[clientId]?.roles ?? [];

        token.roles = Array.from(new Set([...realmRoles, ...clientRoles]));
        token.condominiumId =
          decoded?.condominiumId ??
          decoded?.condominium_id ??
          token.condominiumId;
      }

      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).roles = (token.roles as string[]) ?? [];
      (session as any).condominiumId = token.condominiumId;
      return session;
    },
  },
};