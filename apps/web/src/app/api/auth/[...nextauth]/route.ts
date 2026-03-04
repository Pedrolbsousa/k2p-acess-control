import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

function decodeJwtPayload(jwt: string) {
  const part = jwt.split(".")[1];
  const padded = part.replace(/-/g, "+").replace(/_/g, "/");
  const json = Buffer.from(padded, "base64").toString("utf8");
  return JSON.parse(json);
}

const handler = NextAuth({
  providers: [
    KeycloakProvider({
      issuer: process.env.KEYCLOAK_ISSUER,
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      const t = token as any;

      if (account?.access_token) {
        t.accessToken = account.access_token;
      }

      if (t.accessToken) {
        const payload = decodeJwtPayload(t.accessToken);

        const clientId =
          process.env.KEYCLOAK_CLIENT_ID || payload?.azp || "web";

        const realmRoles: string[] = payload?.realm_access?.roles ?? [];
        const clientRoles: string[] =
          payload?.resource_access?.[clientId]?.roles ?? [];

        t.roles = Array.from(new Set([...realmRoles, ...clientRoles]));

        t.condominiumId = payload?.condominiumId ?? t.condominiumId;
        t.unitId = payload?.unitId ?? t.unitId;
      } else {
        t.roles = t.roles ?? [];
      }

      return t;
    },

    async session({ session, token }) {
      const t = token as any;
      (session as any).accessToken = t.accessToken;
      (session as any).roles = t.roles ?? [];
      (session as any).condominiumId = t.condominiumId;
      (session as any).unitId = t.unitId;
      return session;
    },
  },
});

export { handler as GET, handler as POST };