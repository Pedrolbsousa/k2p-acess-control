/*import { Module } from '@nestjs/common';
import { APP_GUARD } from "@nestjs/core";
import { KeycloakJwtGuard } from "./auth/keycloak-jwt.guard";
import { RolesGuard } from "./auth/roles.guard";
//import { AppController } from './app.controller';
//import { AppService } from './app.service';
//import { PrismaModule } from "./prisma/prisma.module";

@Module({
  //imports: [PrismaModule],
  //controllers: [AppController],
  //providers: [AppService],
  providers: [
    { provide: APP_GUARD, useClass: KeycloakJwtGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}*/
import { Module } from "@nestjs/common";
import { APP_GUARD } from "@nestjs/core";

import { TestController } from "./test.controller";
import { KeycloakJwtGuard } from "./auth/keycloak-jwt.guard";
import { RolesGuard } from "./auth/roles.guard";

@Module({
  controllers: [TestController],
  providers: [
    { provide: APP_GUARD, useClass: KeycloakJwtGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
export class AppModule {}
