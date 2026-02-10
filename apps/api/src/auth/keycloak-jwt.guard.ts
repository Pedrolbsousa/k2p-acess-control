import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { createRemoteJWKSet, jwtVerify } from "jose";

type AuthUser = {
  sub: string;
  roles: string[];
  condominiumId: string | null;
  unitId: string | null;
  tokenPayload: Record<string, any>;
};

// Cache do JWKS (evita buscar a cada request)
let cachedJwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks(jwksUrl: string) {
  if (!cachedJwks) cachedJwks = createRemoteJWKSet(new URL(jwksUrl));
  return cachedJwks;
}

@Injectable()
export class KeycloakJwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const authHeader = req.headers["authorization"] as string | undefined;
    const token =
      authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

    if (!token) throw new UnauthorizedException("Missing bearer token");

    const issuer = process.env.KEYCLOAK_ISSUER;
    const jwksUrl = process.env.KEYCLOAK_JWKS_URL;

    if (!issuer || !jwksUrl) {
      throw new UnauthorizedException("Server auth config missing");
    }

    try {
      const { payload } = await jwtVerify(token, getJwks(jwksUrl), {
        issuer,
      });

      const roles: string[] = (payload as any)?.realm_access?.roles ?? [];

      const user: AuthUser = {
        sub: payload.sub ?? "",
        roles,
        condominiumId: ((payload as any)?.condominiumId as string) ?? null,
        unitId: ((payload as any)?.unitId as string) ?? null,
        tokenPayload: payload as any,
      };

      if (!user.sub) throw new Error("Missing sub");

      req.user = user;
      return true;
    } catch (err) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
