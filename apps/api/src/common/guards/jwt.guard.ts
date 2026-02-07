import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { createRemoteJWKSet, jwtVerify } from "jose";

const issuer = process.env.KEYCLOAK_ISSUER || "http://localhost:8080/realms/k2p";
const jwksUrl = new URL(`${issuer}/protocol/openid-connect/certs`);
const JWKS = createRemoteJWKSet(jwksUrl);

@Injectable()
export class JwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const auth = req.headers["authorization"] as string | undefined;

    if (!auth?.startsWith("Bearer ")) throw new UnauthorizedException("Missing bearer token");

    const token = auth.slice("Bearer ".length);

    try {
      const { payload } = await jwtVerify(token, JWKS, { issuer });
      req.user = payload;
      return true;
    } catch (e: any) {
      throw new UnauthorizedException("Invalid token");
    }
  }
}
