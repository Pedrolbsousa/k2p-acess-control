/*import NextAuth from "next-auth";
import { authOptions } from "@/app/authOptions";

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };*/
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
      if (account?.access_token) token.accessToken = account.access_token;

      const anyProfile = profile as any;
      token.roles = anyProfile?.realm_access?.roles ?? token.roles ?? [];

      token.condominiumId = (anyProfile as any)?.condominiumId ?? token.condominiumId;
      token.unitId = (anyProfile as any)?.unitId ?? token.unitId;

      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      (session as any).roles = token.roles;
      (session as any).condominiumId = token.condominiumId;
      (session as any).unitId = token.unitId;
      return session;
    },
  },
});

export { handler as GET, handler as POST };