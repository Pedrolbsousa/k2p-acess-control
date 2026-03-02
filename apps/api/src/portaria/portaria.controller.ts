import { Controller } from "@nestjs/common";
import { PortariaService } from "./portaria.service";

@Controller("portaria")
export class PortariaController {
  constructor(private readonly portaria: PortariaService) {}

  // ✅ Removido: POST /portaria/packages
  // ✅ Removido: GET /portaria/packages
  // ✅ Removido: POST /portaria/packages/:id/deliver

  // Deixe aqui apenas endpoints gerais de Portaria (se existirem)
}