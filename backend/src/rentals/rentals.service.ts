import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRentalDto, UpdateRentalStatusDto } from './dto/rental.dto';

@Injectable()
export class RentalsService {
  constructor(private prisma: PrismaService) {}

  async create(renterId: string, dto: CreateRentalDto) {
    const asset = await this.prisma.asset.findUnique({ where: { id: dto.assetId } });
    if (!asset) throw new NotFoundException('Asset not found');
    if (asset.status !== 'available')
      throw new BadRequestException('Asset is not available for rent');

    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);
    if (end <= start)
      throw new BadRequestException('End date must be after start date');

    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = Number(asset.dailyRate) * days;

    // Check for overlapping rentals (pending or active)
    const overlapping = await this.prisma.rental.findFirst({
      where: {
        assetId: dto.assetId,
        status: { in: ['pending', 'active'] },
        AND: [
          { startDate: { lte: end } },
          { endDate: { gte: start } },
        ],
      },
    });

    if (overlapping) {
      throw new BadRequestException('Asset is already booked for the selected dates');
    }

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

  async findMyRentals(renterId: string) {
    return this.prisma.rental.findMany({
      where: { renterId },
      include: {
        asset: {
          select: {
            name: true,
            imageUrl: true,
            dailyRate: true,
            location: true,
            description: true,
            condition: true,
            // vehicle fields
            make: true,
            model: true,
            year: true,
            mileage: true,
            transmission: true,
            fuelType: true,
            seats: true,
            // real-estate fields
            propertyType: true,
            bedrooms: true,
            bathrooms: true,
            address: true,
            city: true,
            state: true,
            // include category slug to distinguish type
            category: { select: { slug: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const rental = await this.prisma.rental.findUnique({
      where: { id },
      include: {
        asset: { include: { category: true, owner: { select: { id: true, fullName: true, email: true } } } },
        renter: { select: { id: true, fullName: true, email: true } },
      },
    });
    if (!rental) throw new NotFoundException('Rental not found');
    if (rental.renterId !== userId && rental.asset.ownerId !== userId)
      throw new ForbiddenException('Access denied');
    return rental;
  }

  async updateStatus(id: string, userId: string, dto: UpdateRentalStatusDto) {
    const rental = await this.prisma.rental.findUnique({
      where: { id },
      include: { asset: true },
    });
    if (!rental) throw new NotFoundException('Rental not found');
    if (rental.renterId !== userId && rental.asset.ownerId !== userId)
      throw new ForbiddenException('Access denied');

    return this.prisma.rental.update({
      where: { id },
      data: { status: dto.status as any },
    });
  }
}
