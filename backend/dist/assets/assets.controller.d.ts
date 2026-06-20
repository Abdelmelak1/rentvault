import { AssetsService } from "./assets.service";
import { CreateAssetDto, UpdateAssetDto, AssetQueryDto } from "./dto/asset.dto";
export declare class AssetsController {
    private service;
    constructor(service: AssetsService);
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
    uploadFiles(req: any, files: any[]): Promise<{
        urls: string[];
    }>;
    findMine(req: any, query: AssetQueryDto): Promise<({
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
    create(req: any, dto: CreateAssetDto): Promise<{
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
    update(id: string, req: any, dto: UpdateAssetDto): Promise<{
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
    remove(id: string, req: any): Promise<{
        message: string;
    }>;
}
