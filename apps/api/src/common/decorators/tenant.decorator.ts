import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const TenantId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    // ajuste para o formato do seu req.user
    return req.user?.condominiumId || req.user?.condominium_id;
  },
);