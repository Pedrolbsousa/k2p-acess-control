import { Body, Controller, Get, Param, Post, Query } from "@nestjs/common";
import { CreatePackageDto } from "./dto/create-package.dto";
import { DeliverPackageDto } from "./dto/deliver-package.dto";
import { PortariaService } from "./portaria.service";

@Controller("portaria")
export class PortariaController {
  constructor(private readonly portaria: PortariaService) {}

  @Post("packages")
  create(@Body() dto: CreatePackageDto) {
    //return this.portaria.createPackage(dto);
  }

  @Get("packages")
  list(@Query("status") status?: string) {
    //return this.portaria.listPackages(status);
  }

  @Post("packages/:id/deliver")
  deliver(@Param("id") id: string, @Body() dto: DeliverPackageDto) {
    //return this.portaria.deliverPackage(id, dto);
  }
}