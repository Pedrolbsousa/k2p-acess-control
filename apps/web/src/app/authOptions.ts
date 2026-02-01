import KeycloakProvider from "next-auth/providers/keycloak";

function decodeJwt(token: string): any {
  const [, payload] = token.split(".");
  const decoded = Buffer.from(payload, "base64").toString("utf-8");
  return JSON.parse(decoded);
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
        token.roles = decoded?.realm_access?.roles ?? [];
      }
      return token;
    },
    async session({ session, token }: any) {
      session.accessToken = token.accessToken;
      session.roles = token.roles ?? [];
      return session;
    },
  },
};
