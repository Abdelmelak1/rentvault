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
exports.AssetsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let AssetsService = class AssetsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const where = {};
        if (query.status)
            where.status = query.status;
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: "insensitive" } },
                { location: { contains: query.search, mode: "insensitive" } },
            ];
        }
        if (query.categorySlug) {
            where.category = { slug: query.categorySlug };
        }
        return this.prisma.asset.findMany({
            where,
            include: { category: { select: { name: true, slug: true } } },
            orderBy: { createdAt: "desc" },
        });
    }
    async findByOwner(ownerId, query) {
        const where = { ownerId };
        if (query.status)
            where.status = query.status;
        if (query.search) {
            where.OR = [
                { name: { contains: query.search, mode: "insensitive" } },
                { location: { contains: query.search, mode: "insensitive" } },
            ];
        }
        return this.prisma.asset.findMany({
            where,
            include: { category: { select: { name: true, slug: true } } },
            orderBy: { createdAt: "desc" },
        });
    }
    async findOne(id) {
        const asset = await this.prisma.asset.findUnique({
            where: { id },
            include: {
                category: { select: { name: true, slug: true } },
                owner: {
                    select: { id: true, fullName: true, email: true, avatarUrl: true },
                },
            },
        });
        if (!asset)
            throw new common_1.NotFoundException("Asset not found");
        return asset;
    }
    async create(ownerId, dto) {
        return this.prisma.asset.create({
            data: {
                name: dto.name,
                description: dto.description || "",
                imageUrl: dto.imageUrl || "",
                make: dto.make || null,
                model: dto.model || null,
                year: dto.year || null,
                color: dto.color || null,
                mileage: dto.mileage || null,
                transmission: dto.transmission || null,
                fuelType: dto.fuelType || null,
                seats: dto.seats || null,
                images: dto.images || [],
                dailyRate: dto.dailyRate || 0,
                weeklyRate: dto.weeklyRate || 0,
                monthlyRate: dto.monthlyRate || 0,
                securityDeposit: dto.securityDeposit || 0,
                condition: dto.condition || "good",
                status: dto.status || "available",
                location: dto.location || "",
                ownerId,
                categoryId: dto.categoryId || null,
                vehicleClass: dto.vehicleClass || null,
                cityMpg: dto.cityMpg || null,
                highwayMpg: dto.highwayMpg || null,
                combinationMpg: dto.combinationMpg || null,
                cylinders: dto.cylinders || null,
                displacement: dto.displacement || null,
                drive: dto.drive || null,
                propertyType: dto.propertyType || null,
                bedrooms: dto.bedrooms || null,
                bathrooms: dto.bathrooms || null,
                areaSqft: dto.areaSqft || null,
                address: dto.address || null,
                city: dto.city || null,
                state: dto.state || null,
                zipCode: dto.zipCode || null,
                yearBuilt: dto.yearBuilt || null,
                garage: dto.garage || null,
                hasPool: dto.hasPool || null,
                listingStatus: dto.listingStatus || null,
                price: dto.price || 0,
            },
            include: { category: { select: { name: true, slug: true } } },
        });
    }
    async update(id, userId, dto) {
        await this.verifyOwner(id, userId);
        return this.prisma.asset.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.make !== undefined && { make: dto.make }),
                ...(dto.model !== undefined && { model: dto.model }),
                ...(dto.year !== undefined && { year: dto.year }),
                ...(dto.color !== undefined && { color: dto.color }),
                ...(dto.mileage !== undefined && { mileage: dto.mileage }),
                ...(dto.transmission !== undefined && {
                    transmission: dto.transmission,
                }),
                ...(dto.fuelType !== undefined && { fuelType: dto.fuelType }),
                ...(dto.seats !== undefined && { seats: dto.seats }),
                ...(dto.images !== undefined && { images: dto.images }),
                ...(dto.description !== undefined && { description: dto.description }),
                ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
                ...(dto.dailyRate !== undefined && { dailyRate: dto.dailyRate }),
                ...(dto.weeklyRate !== undefined && { weeklyRate: dto.weeklyRate }),
                ...(dto.monthlyRate !== undefined && { monthlyRate: dto.monthlyRate }),
                ...(dto.securityDeposit !== undefined && {
                    securityDeposit: dto.securityDeposit,
                }),
                ...(dto.condition && { condition: dto.condition }),
                ...(dto.status && { status: dto.status }),
                ...(dto.location !== undefined && { location: dto.location }),
                ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
                ...(dto.vehicleClass !== undefined && { vehicleClass: dto.vehicleClass }),
                ...(dto.cityMpg !== undefined && { cityMpg: dto.cityMpg }),
                ...(dto.highwayMpg !== undefined && { highwayMpg: dto.highwayMpg }),
                ...(dto.combinationMpg !== undefined && { combinationMpg: dto.combinationMpg }),
                ...(dto.cylinders !== undefined && { cylinders: dto.cylinders }),
                ...(dto.displacement !== undefined && { displacement: dto.displacement }),
                ...(dto.drive !== undefined && { drive: dto.drive }),
                ...(dto.propertyType !== undefined && { propertyType: dto.propertyType }),
                ...(dto.bedrooms !== undefined && { bedrooms: dto.bedrooms }),
                ...(dto.bathrooms !== undefined && { bathrooms: dto.bathrooms }),
                ...(dto.areaSqft !== undefined && { areaSqft: dto.areaSqft }),
                ...(dto.address !== undefined && { address: dto.address }),
                ...(dto.city !== undefined && { city: dto.city }),
                ...(dto.state !== undefined && { state: dto.state }),
                ...(dto.zipCode !== undefined && { zipCode: dto.zipCode }),
                ...(dto.yearBuilt !== undefined && { yearBuilt: dto.yearBuilt }),
                ...(dto.garage !== undefined && { garage: dto.garage }),
                ...(dto.hasPool !== undefined && { hasPool: dto.hasPool }),
                ...(dto.listingStatus !== undefined && { listingStatus: dto.listingStatus }),
                ...(dto.price !== undefined && { price: dto.price }),
            },
            include: { category: { select: { name: true, slug: true } } },
        });
    }
    async remove(id, userId) {
        await this.verifyOwner(id, userId);
        await this.prisma.asset.delete({ where: { id } });
        return { message: "Asset deleted" };
    }
    async verifyOwner(assetId, userId) {
        const asset = await this.prisma.asset.findUnique({
            where: { id: assetId },
        });
        if (!asset)
            throw new common_1.NotFoundException("Asset not found");
        if (asset.ownerId !== userId)
            throw new common_1.ForbiddenException("Not your asset");
        return asset;
    }
};
exports.AssetsService = AssetsService;
exports.AssetsService = AssetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AssetsService);
//# sourceMappingURL=assets.service.js.map