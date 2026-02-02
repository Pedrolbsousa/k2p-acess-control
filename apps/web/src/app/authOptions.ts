import KeycloakProvider from "next-auth/providers/keycloak";

function base64UrlDecode(input: string) {
  const pad = "=".repeat((4 - (input.length % 4)) % 4);
  const base64 = (input + pad).replace(/-/g, "+").replace(/_/g, "/");
  return Buffer.from(base64, "base64").toString("utf-8");
}

function decodeJwt(token: string): any {
  const [, payload] = token.split(".");
  return JSON.parse(base64UrlDecode(payload));
}

export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }: any) {
      if (account?.access_token) {
        token.accessToken = account.access_token;

        const decoded = decodeJwt(account.access_token);
        const clientId = process.env.KEYCLOAK_CLIENT_ID!; // "web"

        const clientRoles: string[] = decoded?.resource_access?.[clientId]?.roles ?? [];
        const realmRoles: string[] = decoded?.realm_access?.roles ?? [];

        token.roles = Array.from(new Set([...realmRoles, ...clientRoles]));
      }
      return token;
    },
    async session({ session, token }: any) {
      (session as any).accessToken = token.accessToken;
      (session as any).roles = token.roles ?? [];
      return session;
    },
  },
};
