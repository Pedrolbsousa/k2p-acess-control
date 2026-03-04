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

  async create(dto: CreatePackageDto, tenantId: string) {
    if (!tenantId) {
      throw new BadRequestException('Tenant (condominiumId) não encontrado no token');
    }

    return this.prisma.packageDelivery.create({
      data: {
        ...dto,
        condominiumId: tenantId,
      },
    });
  }

  async list(tenantId: string, filters: ListFilters = {}) {
    if (!tenantId) {
      throw new BadRequestException('Tenant (condominiumId) não encontrado no token');
    }

    const status =
      typeof filters.status === 'string' && filters.status.trim().length > 0
        ? filters.status.trim().toUpperCase()
        : undefined;
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