import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { createRemoteJWKSet, jwtVerify } from "jose";

const jwks = (jwksUrl: string) => createRemoteJWKSet(new URL(jwksUrl));

@Injectable()
export class KeycloakJwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const auth = req.headers["authorization"] as string | undefined;
    const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) throw new UnauthorizedException("Missing bearer token");

    try {
      const issuer = process.env.KEYCLOAK_ISSUER!;
      const jwksUrl = process.env.KEYCLOAK_JWKS_URL!;

      const { payload } = await jwtVerify(token, jwks(jwksUrl), {
        issuer,
      });

      const roles = (payload as any)?.realm_access?.roles ?? [];
      req.user = {
        sub: payload.sub,
        roles,
        condominiumId: (payload as any)?.condominiumId ?? null,
        unitId: (payload as any)?.unitId ?? null,
        tokenPayload: payload,
      };

      return true;
    } catch (e) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
