import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { TestController } from "./test.controller";
import { KeycloakJwtGuard } from "./auth/keycloak-jwt.guard";
import { RolesGuard } from "./common/guards/roles.guard";
import { PrismaModule } from "./prisma/prisma.module";
import { PortariaModule } from "./portaria/portaria.module";

@Module({
  imports: [PortariaModule, PrismaModule],
  controllers: [TestController],
  providers: [
    { provide: APP_GUARD, useClass: KeycloakJwtGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
 
})
export class AppModule {}
