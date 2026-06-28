"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let RentalsService = class RentalsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(renterId, dto) {
        try {
            console.log(`[Rental Attempt] renterId=${renterId} assetId=${dto.assetId || "(snapshot)"} start=${dto.startDate} end=${dto.endDate}`);
        }
        catch (e) { }
        let asset = null;
        if (dto.assetId) {
            asset = await this.prisma.asset.findUnique({ where: { id: dto.assetId } });
            if (!asset)
                throw new common_1.NotFoundException("Asset not found");
            try {
                console.log(`[Rental Attempt] asset.ownerId=${asset.ownerId} status=${asset.status}`);
            }
            catch (e) { }
            if (asset.status !== "available")
                throw new common_1.BadRequestException("Asset is not available for rent");
        }
        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);
        if (end <= start)
            throw new common_1.BadRequestException("End date must be after start date");
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = asset ? Number(asset.dailyRate) * days : (dto.snapshotDailyRate || 0) * days;
        if (asset) {
            if (asset.ownerId === renterId) {
                try {
                    console.log(`[Rental Block] owner tried to rent own asset ownerId=${asset.ownerId} renterId=${renterId} assetId=${dto.assetId}`);
                }
                catch (e) { }
                throw new common_1.BadRequestException("You cannot rent your own asset");
            }
            const overlapping = await this.prisma.rental.findFirst({
                where: {
                    assetId: dto.assetId,
                    status: { in: ["pending", "active"] },
                    AND: [{ startDate: { lte: end } }, { endDate: { gte: start } }],
                },
            });
            if (overlapping) {
                try {
                    console.log(`[Rental Overlap] assetId=${dto.assetId} overlappingRentalId=${overlapping.id}`);
                }
                catch (e) { }
                throw new common_1.BadRequestException("Asset is already booked for the selected dates");
            }
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
        try {
            console.log(`[Rental Snapshot] renterId=${renterId} title=${dto.snapshotTitle || ""} dailyRate=${dto.snapshotDailyRate || 0}`);
        }
        catch (e) { }
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
    async findMyRentals(renterId) {
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
    async findIncomingRequests(ownerId) {
        return this.prisma.rental.findMany({
            where: { status: "pending", asset: { ownerId } },
            include: {
                asset: { select: { id: true, name: true, imageUrl: true, location: true } },
                renter: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async findByOwner(ownerId, status) {
        const where = { asset: { ownerId } };
        if (status)
            where.status = status;
        return this.prisma.rental.findMany({
            where,
            include: {
                asset: { select: { id: true, name: true, imageUrl: true, ownerId: true } },
                renter: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    }
    async findOne(id, userId) {
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
        if (!rental)
            throw new common_1.NotFoundException("Rental not found");
        const assetOwnerId = rental.asset ? rental.asset.ownerId : undefined;
        if (rental.renterId !== userId && assetOwnerId !== userId)
            throw new common_1.ForbiddenException("Access denied");
        return rental;
    }
    async updateStatus(id, userId, dto) {
        const rental = await this.prisma.rental.findUnique({
            where: { id },
            include: { asset: true },
        });
        if (!rental)
            throw new common_1.NotFoundException("Rental not found");
        if (rental.renterId !== userId && rental.asset.ownerId !== userId)
            throw new common_1.ForbiddenException("Access denied");
        if (dto.status === "active" && rental.asset.ownerId === userId) {
            const start = rental.startDate;
            const end = rental.endDate;
            const assetId = rental.assetId;
            const result = await this.prisma.$transaction(async (tx) => {
                const updated = await tx.rental.update({
                    where: { id },
                    data: { status: "active" },
                });
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
        if (dto.status === "cancelled" || dto.status === "completed") {
            const assetId = rental.assetId;
            const result = await this.prisma.$transaction(async (tx) => {
                const updated = await tx.rental.update({
                    where: { id },
                    data: { status: dto.status },
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
        return this.prisma.rental.update({
            where: { id },
            data: { status: dto.status },
        });
    }
};
exports.RentalsService = RentalsService;
exports.RentalsService = RentalsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RentalsService);
//# sourceMappingURL=rentals.service.js.map