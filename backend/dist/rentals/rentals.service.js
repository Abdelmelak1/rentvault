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
        const asset = await this.prisma.asset.findUnique({ where: { id: dto.assetId } });
        if (!asset)
            throw new common_1.NotFoundException('Asset not found');
        if (asset.status !== 'available')
            throw new common_1.BadRequestException('Asset is not available for rent');
        const start = new Date(dto.startDate);
        const end = new Date(dto.endDate);
        if (end <= start)
            throw new common_1.BadRequestException('End date must be after start date');
        const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = Number(asset.dailyRate) * days;
        const rental = await this.prisma.rental.create({
            data: {
                assetId: dto.assetId,
                renterId,
                startDate: start,
                endDate: end,
                totalPrice,
                securityDeposit: asset.securityDeposit,
                notes: dto.notes || '',
                status: 'pending',
            },
            include: {
                asset: { select: { name: true, imageUrl: true, dailyRate: true } },
            },
        });
        return rental;
    }
    async findMyRentals(renterId) {
        return this.prisma.rental.findMany({
            where: { renterId },
            include: {
                asset: { select: { name: true, imageUrl: true, dailyRate: true, location: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId) {
        const rental = await this.prisma.rental.findUnique({
            where: { id },
            include: {
                asset: { include: { category: true, owner: { select: { id: true, fullName: true, email: true } } } },
                renter: { select: { id: true, fullName: true, email: true } },
            },
        });
        if (!rental)
            throw new common_1.NotFoundException('Rental not found');
        if (rental.renterId !== userId && rental.asset.ownerId !== userId)
            throw new common_1.ForbiddenException('Access denied');
        return rental;
    }
    async updateStatus(id, userId, dto) {
        const rental = await this.prisma.rental.findUnique({
            where: { id },
            include: { asset: true },
        });
        if (!rental)
            throw new common_1.NotFoundException('Rental not found');
        if (rental.renterId !== userId && rental.asset.ownerId !== userId)
            throw new common_1.ForbiddenException('Access denied');
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