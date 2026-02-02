import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const realmRoles: string[] = user?.realm_access?.roles ?? [];
    const clientId = process.env.KEYCLOAK_CLIENT_ID || "web";
    const clientRoles: string[] = user?.resource_access?.[clientId]?.roles ?? [];

    const roles = new Set([...realmRoles, ...clientRoles]);
    const ok = requiredRoles.some((r) => roles.has(r));

    if (!ok) throw new ForbiddenException("Insufficient role");
    return true;
  }
}
