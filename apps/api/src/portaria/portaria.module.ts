import { Module } from "@nestjs/common";
import { PortariaController } from "./portaria.controller";
import { PortariaService } from "./portaria.service";
import { PrismaModule } from "../prisma/prisma.module";
import { PackagesController } from "./packages/packages.controller";
import { PackagesService } from "./packages/packages.service";

@Module({
  imports: [PrismaModule],
  controllers: [PortariaController, PackagesController],
  providers: [PortariaService, PackagesService],
})
export class PortariaModule {}