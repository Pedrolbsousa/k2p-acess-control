import { createParamDecorator, ExecutionContext, UnauthorizedException } from "@nestjs/common";

function firstDefined(...values: any[]) {
  for (const v of values) {
    if (v !== undefined && v !== null && String(v).trim() !== "") return v;
  }
  return undefined;
}

export const TenantId = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();

  // 1) tenta do user (claims mais comuns)
  const fromUser = firstDefined(
    req.user?.condominiumId,
    req.user?.condominium_id,
    req.user?.tenantId,
    req.user?.tenant_id,
    req.user?.["https://k2p/condominiumId"], // caso você use claim namespaced
  );

  // 2) fallback por header (útil pra destravar dev, ou se token não tiver claim ainda)
  const fromHeader = firstDefined(
    req.headers?.["x-condominium-id"],
    req.headers?.["x-tenant-id"],
  );

  const tenantId = fromUser ?? fromHeader;

  if (!tenantId) {
    // IMPORTANTE: não use throw new Error (vira 500)
    throw new UnauthorizedException("Tenant (condominiumId) não encontrado no token");
  }

  return String(tenantId);
});