import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreatePackageDto } from "./dto/create-package.dto";
import { DeliverPackageDto } from "./dto/deliver-package.dto";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class PortariaService {
  //constructor(private readonly prisma: PrismaService) {}

  async createPackage(dto: CreatePackageDto) {
    const now = new Date();

    const data: any = {
      unitId: dto.unitId,
      recipientPersonId: dto.recipientPersonId ?? null,
      carrier: dto.carrier ?? null,
      trackingCode: dto.trackingCode ?? null,
      description: dto.description ?? null,
      status: "RECEIVED",
      receivedAt: now,
      events: {
        create: {
          type: "RECEIVED",
          occurredAt: now,
          performedByPersonId: null,
          payload: dto as any,
        },
      },
    };

    if (dto.photoUrl) {
      data.photos = {
        create: {
          photoUrl: dto.photoUrl,
          photoType: "ARRIVAL",
          createdAt: now,
        },
      };
    }

    /*const created = await this.prisma.packageDelivery.create({
      data,
      include: { events: true, photos: true },
    });

    return created;
  }

  async listPackages(status?: string) {
    return this.prisma.packageDelivery.findMany({
      where: status ? { status: status as any } : undefined,
      orderBy: { createdAt: "desc" },
      include: { photos: true, events: true },
      take: 100,
    });
  }

  async deliverPackage(id: string, dto: DeliverPackageDto) {
    const existing = await this.prisma.packageDelivery.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException("Encomenda não encontrada");

    if (existing.status !== "RECEIVED") {
      throw new BadRequestException(
        `Encomenda não pode ser baixada (status atual: ${existing.status})`,
      );
    }

    const now = new Date();

    const data: any = {
      status: "DELIVERED",
      deliveredAt: now,
      deliveredToName: dto.deliveredToName,
      deliveredToDocument: dto.deliveredToDocument ?? null,
      events: {
        create: {
          type: "DELIVERED",
          occurredAt: now,
          performedByPersonId: null,
          payload: dto as any,
        },
      },
    };*/

    if (dto.photoUrl) {
      data.photos = {
        create: {
          photoUrl: dto.photoUrl,
          photoType: "PICKUP_PROOF",
          createdAt: now,
        },
      };
    }
    /*
    const updated = await this.prisma.packageDelivery.update({
      where: { id },
      data,
      include: { events: true, photos: true },
    });*/

    return data;
  }
}
