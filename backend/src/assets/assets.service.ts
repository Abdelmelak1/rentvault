import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto, UpdateAssetDto, AssetQueryDto } from './dto/asset.dto';

@Injectable()
export class AssetsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: AssetQueryDto) {
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { location: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    if (query.categorySlug) {
      where.category = { slug: query.categorySlug };
    }
    return this.prisma.asset.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByOwner(ownerId: string, query: AssetQueryDto) {
    const where: any = { ownerId };
    if (query.status) where.status = query.status;
    if (query.search) {
      where.OR = [
        { name: { contains: query.search, mode: 'insensitive' } },
        { location: { contains: query.search, mode: 'insensitive' } },
      ];
    }
    return this.prisma.asset.findMany({
      where,
      include: { category: { select: { name: true, slug: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const asset = await this.prisma.asset.findUnique({
      where: { id },
      include: {
        category: { select: { name: true, slug: true } },
        owner: { select: { id: true, fullName: true, email: true, avatarUrl: true } },
      },
    });
    if (!asset) throw new NotFoundException('Asset not found');
    return asset;
  }

  async create(ownerId: string, dto: CreateAssetDto) {
    return this.prisma.asset.create({
      data: {
        name: dto.name,
        description: dto.description || '',
        imageUrl: dto.imageUrl || '',
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
        condition: (dto.condition as any) || 'good',
        status: (dto.status as any) || 'available',
        location: dto.location || '',
        ownerId,
        categoryId: dto.categoryId || null,
      },
      include: { category: { select: { name: true, slug: true } } },
    });
  }

  async update(id: string, userId: string, dto: UpdateAssetDto) {
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
        ...(dto.transmission !== undefined && { transmission: dto.transmission }),
        ...(dto.fuelType !== undefined && { fuelType: dto.fuelType }),
        ...(dto.seats !== undefined && { seats: dto.seats }),
        ...(dto.images !== undefined && { images: dto.images }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.imageUrl !== undefined && { imageUrl: dto.imageUrl }),
        ...(dto.dailyRate !== undefined && { dailyRate: dto.dailyRate }),
        ...(dto.weeklyRate !== undefined && { weeklyRate: dto.weeklyRate }),
        ...(dto.monthlyRate !== undefined && { monthlyRate: dto.monthlyRate }),
        ...(dto.securityDeposit !== undefined && { securityDeposit: dto.securityDeposit }),
        ...(dto.condition && { condition: dto.condition as any }),
        ...(dto.status && { status: dto.status as any }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.categoryId !== undefined && { categoryId: dto.categoryId }),
      },
      include: { category: { select: { name: true, slug: true } } },
    });
  }

  async remove(id: string, userId: string) {
    await this.verifyOwner(id, userId);
    await this.prisma.asset.delete({ where: { id } });
    return { message: 'Asset deleted' };
  }

  private async verifyOwner(assetId: string, userId: string) {
    const asset = await this.prisma.asset.findUnique({ where: { id: assetId } });
    if (!asset) throw new NotFoundException('Asset not found');
    if (asset.ownerId !== userId) throw new ForbiddenException('Not your asset');
    return asset;
  }
}
