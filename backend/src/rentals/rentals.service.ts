import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateRentalDto, UpdateRentalStatusDto } from "./dto/rental.dto";

@Injectable()
export class RentalsService {
  constructor(private prisma: PrismaService) {}

  async create(renterId: string, dto: CreateRentalDto) {
    // Debug: incoming rental attempt
    try {
      console.log(`[Rental Attempt] renterId=${renterId} assetId=${dto.assetId || "(snapshot)"} start=${dto.startDate} end=${dto.endDate}`);
    } catch (e) {}

    let asset: any = null;
    if (dto.assetId) {
      asset = await this.prisma.asset.findUnique({ where: { id: dto.assetId } });
      if (!asset) throw new NotFoundException("Asset not found");
      try {
        console.log(`[Rental Attempt] asset.ownerId=${asset.ownerId} status=${asset.status}`);
      } catch (e) {}
      if (asset.status !== "available")
        throw new BadRequestException("Asset is not available for rent");
    }

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end <= start)
      throw new BadRequestException("End date must be after start date");

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = asset ? Number(asset.dailyRate) * days : (dto.snapshotDailyRate || 0) * days;

    // If asset is provided: ensure no overlaps and mark asset pending
    if (asset) {
      // Prevent owners from renting their own assets
      if (asset.ownerId === renterId) {
        try { console.log(`[Rental Block] owner tried to rent own asset ownerId=${asset.ownerId} renterId=${renterId} assetId=${dto.assetId}`); } catch(e) {}
        throw new BadRequestException("You cannot rent your own asset");
      }
      const overlapping = await this.prisma.rental.findFirst({
        where: {
          assetId: dto.assetId,
          status: { in: ["pending", "active"] },
          AND: [{ startDate: { lte: end } }, { endDate: { gte: start } }],
        },
      });

      if (overlapping) {
        try { console.log(`[Rental Overlap] assetId=${dto.assetId} overlappingRentalId=${overlapping.id}`); } catch(e) {}
        throw new BadRequestException("Asset is already booked for the selected dates");
      }

      // Create rental and mark asset as pending in a transaction
      const rental = await this.prisma.$transaction(async (tx) => {
        const created = await tx.rental.create({
          data: {
            assetId: dto.assetId,
            renterId,
            startDate: start,
            endDate: end,
            totalPrice,
            securityDeposit: asset.securityDeposit,
            notes: dto.notes || "",
            status: "pending",
          },
          include: {
            asset: { select: { name: true, imageUrl: true, dailyRate: true, ownerId: true } },
          },
        });

        await tx.asset.update({ where: { id: dto.assetId }, data: { status: "pending" } });

        return created;
      });

      return rental;
    }

    // Otherwise create a rental snapshot for a non-persisted/catalog item
    try {
      console.log(`[Rental Snapshot] renterId=${renterId} title=${dto.snapshotTitle || ""} dailyRate=${dto.snapshotDailyRate || 0}`);
    } catch (e) {}

    const rental = await this.prisma.rental.create({
      data: {
        assetId: null,
        renterId,
        startDate: start,
        endDate: end,
        totalPrice,
        securityDeposit: dto.snapshotSecurityDeposit || 0,
        notes: dto.notes || "",
        status: "pending",
        snapshotTitle: dto.snapshotTitle || null,
        snapshotImageUrl: dto.snapshotImageUrl || null,
        snapshotOwnerName: dto.snapshotOwnerName || null,
        snapshotOwnerEmail: dto.snapshotOwnerEmail || null,
        snapshotOwnerPhone: dto.snapshotOwnerPhone || null,
      },
      include: { renter: { select: { id: true, fullName: true, email: true } } },
    });

    return rental;
  }

  async findMyRentals(renterId: string) {
    return this.prisma.rental.findMany({
      where: { renterId },
      include: {
        asset: {
          include: {
            owner: { select: { id: true, fullName: true, email: true, phone: true, avatarUrl: true } },
            category: { select: { slug: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findIncomingRequests(ownerId: string) {
    return this.prisma.rental.findMany({
      where: { status: "pending", asset: { ownerId } },
      include: {
        asset: { select: { id: true, name: true, imageUrl: true, location: true } },
        renter: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByOwner(ownerId: string, status?: string) {
    const where: any = { asset: { ownerId } };
    if (status) where.status = status;
    return this.prisma.rental.findMany({
      where,
      include: {
        asset: { select: { id: true, name: true, imageUrl: true, ownerId: true } },
        renter: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOne(id: string, userId: string) {
    const rental = await this.prisma.rental.findUnique({
      where: { id },
      include: {
        asset: {
          include: {
            category: true,
            owner: { select: { id: true, fullName: true, email: true, phone: true, avatarUrl: true } },
          },
        },
        renter: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!rental) throw new NotFoundException("Rental not found");
    const assetOwnerId = rental.asset ? (rental.asset.ownerId as string | undefined) : undefined;
    if (rental.renterId !== userId && assetOwnerId !== userId)
      throw new ForbiddenException("Access denied");
    return rental;
  }

  async updateStatus(id: string, userId: string, dto: UpdateRentalStatusDto) {
    const rental = await this.prisma.rental.findUnique({
      where: { id },
      include: { asset: true },
    });
    if (!rental) throw new NotFoundException("Rental not found");
    if (rental.renterId !== userId && rental.asset.ownerId !== userId)
      throw new ForbiddenException("Access denied");

    // If owner confirms a pending request, activate it, mark asset unavailable,
    // and cancel other overlapping pending requests transactionally.
    if (dto.status === "active" && rental.asset.ownerId === userId) {
      const start = rental.startDate;
      const end = rental.endDate;
      const assetId = rental.assetId;

      const result = await this.prisma.$transaction(async (tx) => {
        const updated = await tx.rental.update({
          where: { id },
          data: { status: "active" },
        });

        // mark asset as rented when owner accepts
        await tx.asset.update({
          where: { id: assetId },
          data: { status: "rented" },
        });

        await tx.rental.updateMany({
          where: {
            assetId,
            status: "pending",
            id: { not: id },
            AND: [{ startDate: { lte: end } }, { endDate: { gte: start } }],
          },
          data: { status: "cancelled" },
        });

        return updated;
      });

      return result;
    }

    // Handle cancellations/completions by restoring asset availability if no other active/pending rentals exist
    if (dto.status === "cancelled" || dto.status === "completed") {
      const assetId = rental.assetId;
      const result = await this.prisma.$transaction(async (tx) => {
        const updated = await tx.rental.update({
          where: { id },
          data: { status: dto.status as any },
        });

        const other = await tx.rental.findFirst({
          where: { assetId, status: { in: ["pending", "active"] } },
        });

        if (!other) {
          await tx.asset.update({ where: { id: assetId }, data: { status: "available" } });
        }

        return updated;
      });

      return result;
    }

    // Fallback: simple status update (allowed for renter or owner)
    return this.prisma.rental.update({
      where: { id },
      data: { status: dto.status as any },
    });
  }
}
