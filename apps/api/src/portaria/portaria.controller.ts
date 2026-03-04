import { Controller } from "@nestjs/common";
import { PortariaService } from "./portaria.service";

@Controller("portaria")
export class PortariaController {
  constructor(private readonly portaria: PortariaService) {}

}