import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

const handler = NextAuth({
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
      const clientId = process.env.KEYCLOAK_CLIENT_ID || "web";

      const realmRoles: string[] = p?.realm_access?.roles ?? [];
      const clientRoles: string[] = p?.resource_access?.[clientId]?.roles ?? [];

      const existing: string[] = Array.isArray(t.roles) ? t.roles : [];
      t.roles = Array.from(new Set([...existing, ...realmRoles, ...clientRoles]));

      t.condominiumId = p?.condominiumId ?? t.condominiumId;
      t.unitId = p?.unitId ?? t.unitId;

      return t;
    },
    async session({ session, token }) {
      (session as any).accessToken = (token as any).accessToken;
      (session as any).roles = (token as any).roles ?? [];
      (session as any).condominiumId = (token as any).condominiumId;
      (session as any).unitId = (token as any).unitId;
      return session;
    },
  },
});

export { handler as GET, handler as POST };