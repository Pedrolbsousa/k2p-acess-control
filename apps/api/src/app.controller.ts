import { Controller, Get, UseGuards, Req } from "@nestjs/common";
import { JwtGuard } from "./common/guards/jwt.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { Roles } from "./common/decorators/roles.decorator";

@Controller()
export class AppController {
  @Get("health")
  health() {
    return { ok: true };
  }

  @UseGuards(JwtGuard, RolesGuard)
  @Roles("ADMIN_CONDOMINIO", "PORTARIA", "SINDICO", "MORADOR")
  @Get("me")
  me(@Req() req: any) {
    return { user: req.user };
  }
}
