import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { IS_PUBLIC_KEY } from "./public.decorator";

@Injectable()
export class KeycloakJwtGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) return true;

        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers["authorization"] as string | undefined;
        const token =
            authHeader?.startsWith("Bearer ") ? authHeader.slice(7).trim() : null;

        if (!token) throw new UnauthorizedException("Missing bearer token");

        const issuer = process.env.KEYCLOAK_ISSUER;
        const jwksUrl = process.env.KEYCLOAK_JWKS_URL;
        if (!issuer || !jwksUrl) throw new UnauthorizedException("Server auth config missing");

        try {
            const { payload } = await jwtVerify(token, createRemoteJWKSet(new URL(jwksUrl)), { issuer });
            const azp = (payload as any)?.azp as string | undefined;

            const roles: string[] =
                (payload as any)?.realm_access?.roles ??
                (payload as any)?.resource_access?.web?.roles ??
                [];
                
            console.log("extracted roles", roles);

            req.user = {
                sub: payload.sub ?? "",
                roles,
                condominiumId: ((payload as any)?.condominiumId as string) ?? null,
                unitId: ((payload as any)?.unitId as string) ?? null,
                tokenPayload: payload as any,
            };

            return true;
        } catch {
            throw new UnauthorizedException("Invalid token");
        }
    }
}
