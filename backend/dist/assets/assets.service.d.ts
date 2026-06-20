import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto, UpdateAssetDto, AssetQueryDto } from './dto/asset.dto';
export declare class AssetsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: AssetQueryDto): Promise<({
        category: {
            name: string;
            slug: string;
        };
    } & {
        id: string;
        name: string;
        description: string;
        imageUrl: string;
        make: string | null;
        model: string | null;
        year: number | null;
        color: string | null;
        mileage: number | null;
        transmission: string | null;
        fuelType: string | null;
        seats: number | null;
        images: string[];
        dailyRate: import("@prisma/client/runtime/library").Decimal;
        weeklyRate: import("@prisma/client/runtime/library").Decimal;
        monthlyRate: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        condition: import(".prisma/client").$Enums.Condition;
        status: import(".prisma/client").$Enums.AssetStatus;
        location: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        categoryId: string | null;
    })[]>;
    findByOwner(ownerId: string, query: AssetQueryDto): Promise<({
        category: {
            name: string;
            slug: string;
        };
    } & {
        id: string;
        name: string;
        description: string;
        imageUrl: string;
        make: string | null;
        model: string | null;
        year: number | null;
        color: string | null;
        mileage: number | null;
        transmission: string | null;
        fuelType: string | null;
        seats: number | null;
        images: string[];
        dailyRate: import("@prisma/client/runtime/library").Decimal;
        weeklyRate: import("@prisma/client/runtime/library").Decimal;
        monthlyRate: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        condition: import(".prisma/client").$Enums.Condition;
        status: import(".prisma/client").$Enums.AssetStatus;
        location: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        categoryId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        category: {
            name: string;
            slug: string;
        };
        owner: {
            email: string;
            fullName: string;
            id: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        name: string;
        description: string;
        imageUrl: string;
        make: string | null;
        model: string | null;
        year: number | null;
        color: string | null;
        mileage: number | null;
        transmission: string | null;
        fuelType: string | null;
        seats: number | null;
        images: string[];
        dailyRate: import("@prisma/client/runtime/library").Decimal;
        weeklyRate: import("@prisma/client/runtime/library").Decimal;
        monthlyRate: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        condition: import(".prisma/client").$Enums.Condition;
        status: import(".prisma/client").$Enums.AssetStatus;
        location: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        categoryId: string | null;
    }>;
    create(ownerId: string, dto: CreateAssetDto): Promise<{
        category: {
            name: string;
            slug: string;
        };
    } & {
        id: string;
        name: string;
        description: string;
        imageUrl: string;
        make: string | null;
        model: string | null;
        year: number | null;
        color: string | null;
        mileage: number | null;
        transmission: string | null;
        fuelType: string | null;
        seats: number | null;
        images: string[];
        dailyRate: import("@prisma/client/runtime/library").Decimal;
        weeklyRate: import("@prisma/client/runtime/library").Decimal;
        monthlyRate: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        condition: import(".prisma/client").$Enums.Condition;
        status: import(".prisma/client").$Enums.AssetStatus;
        location: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        categoryId: string | null;
    }>;
    update(id: string, userId: string, dto: UpdateAssetDto): Promise<{
        category: {
            name: string;
            slug: string;
        };
    } & {
        id: string;
        name: string;
        description: string;
        imageUrl: string;
        make: string | null;
        model: string | null;
        year: number | null;
        color: string | null;
        mileage: number | null;
        transmission: string | null;
        fuelType: string | null;
        seats: number | null;
        images: string[];
        dailyRate: import("@prisma/client/runtime/library").Decimal;
        weeklyRate: import("@prisma/client/runtime/library").Decimal;
        monthlyRate: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        condition: import(".prisma/client").$Enums.Condition;
        status: import(".prisma/client").$Enums.AssetStatus;
        location: string;
        createdAt: Date;
        updatedAt: Date;
        ownerId: string;
        categoryId: string | null;
    }>;
    remove(id: string, userId: string): Promise<{
        message: string;
    }>;
    private verifyOwner;
}
