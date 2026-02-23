import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePackageDto } from '../dto/create-package.dto';

type ListFilters = {
  status?: string;
  unitId?: string;
};

@Injectable()
export class PackagesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Cria uma encomenda SEMPRE no tenant atual.
   * Não confie em condominiumId vindo do front.
   */
  async create(dto: CreatePackageDto, tenantId: string) {
    if (!tenantId) {
      throw new BadRequestException('Tenant (condominiumId) não encontrado no token');
    }

    return this.prisma.packageDelivery.create({
      data: {
        ...dto,
        condominiumId: tenantId,
        // seu schema já defaulta status para RECEIVED, mas pode setar explicitamente se quiser:
        // status: 'RECEIVED',
      },
    });
  }

  /**
   * Lista encomendas do tenant atual.
   * Permite filtrar por status e unitId.
   */
  async list(tenantId: string, filters: ListFilters = {}) {
    if (!tenantId) {
      throw new BadRequestException('Tenant (condominiumId) não encontrado no token');
    }

    const status =
      typeof filters.status === 'string' && filters.status.trim().length > 0
        ? filters.status.trim().toUpperCase()
        : undefined;

    // Opcional: validar status conforme seu enum PackageStatus
    // Ajuste se seu enum tiver outros valores além de RECEIVED/DELIVERED
    const allowed = new Set(['RECEIVED', 'DELIVERED']);
    if (status && !allowed.has(status)) {
      throw new BadRequestException('Status inválido. Use RECEIVED ou DELIVERED');
    }

    return this.prisma.packageDelivery.findMany({
      where: {
        condominiumId: tenantId,
        ...(status ? { status: status as any } : {}),
        ...(filters.unitId ? { unitId: filters.unitId } : {}),
      },
      orderBy: { createdAt: 'desc' },
      include: {
        photos: true,
        events: true,
      },
    });
  }

  /**
   * Dá baixa (entrega) SOMENTE se pertencer ao tenant atual.
   * deliveredByPersonId: use um identificador de pessoa/sujeito do seu domínio.
   * (se você estiver passando req.user.sub do keycloak, tudo bem por enquanto,
   *  mas ideal é mapear sub -> personId)
   */
  async deliver(id: string, tenantId: string, deliveredByPersonId: string) {
    if (!tenantId) {
      throw new BadRequestException('Tenant (condominiumId) não encontrado no token');
    }
    if (!id) {
      throw new BadRequestException('ID da encomenda é obrigatório');
    }

    const pkg = await this.prisma.packageDelivery.findFirst({
      where: { id, condominiumId: tenantId },
    });

    if (!pkg) {
      throw new NotFoundException('Encomenda não encontrada');
    }

    // idempotente: se já entregue, retorna
    if (pkg.status === 'DELIVERED') {
      return pkg;
    }

    return this.prisma.packageDelivery.update({
      where: { id },
      data: {
        status: 'DELIVERED',
        deliveredAt: new Date(),
        deliveredByPersonId: deliveredByPersonId || null,
      },
    });
  }
}