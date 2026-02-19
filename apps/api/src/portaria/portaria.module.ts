import { Module } from "@nestjs/common";
import { PortariaController } from "./portaria.controller";
import { PortariaService } from "./portaria.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [PortariaController],//[Nest] 14500  - 19/02/2026, 16:37:47     LOG [InstanceLoader] PrismaModule dependencies initialized +9ms ERROR [ExceptionHandler] UnknownDependenciesException [Error]: Nest can't resolve dependencies of the PortariaController (?). Please make sure that the argument PortariaSer
  providers: [PortariaService],
})
export class PortariaModule {}