import { RentalsService } from './rentals.service';
import { CreateRentalDto, UpdateRentalStatusDto } from './dto/rental.dto';
export declare class RentalsController {
    private service;
    constructor(service: RentalsService);
    create(req: any, dto: CreateRentalDto): Promise<({
        asset: {
            name: string;
            imageUrl: string;
            dailyRate: import("@prisma/client/runtime/library").Decimal;
            ownerId: string;
        };
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.RentalStatus;
        notes: string;
        snapshotTitle: string | null;
        snapshotImageUrl: string | null;
        snapshotOwnerName: string | null;
        snapshotOwnerEmail: string | null;
        snapshotOwnerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
        assetId: string | null;
        renterId: string;
    }) | ({
        renter: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.RentalStatus;
        notes: string;
        snapshotTitle: string | null;
        snapshotImageUrl: string | null;
        snapshotOwnerName: string | null;
        snapshotOwnerEmail: string | null;
        snapshotOwnerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
        assetId: string | null;
        renterId: string;
    })>;
    findMine(req: any): Promise<({
        asset: {
            category: {
                slug: string;
            };
            owner: {
                email: string;
                fullName: string;
                id: string;
                avatarUrl: string;
                phone: string;
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
            vehicleClass: string | null;
            cityMpg: number | null;
            highwayMpg: number | null;
            combinationMpg: number | null;
            cylinders: number | null;
            displacement: number | null;
            drive: string | null;
            propertyType: string | null;
            bedrooms: number | null;
            bathrooms: number | null;
            areaSqft: number | null;
            address: string | null;
            city: string | null;
            state: string | null;
            zipCode: string | null;
            yearBuilt: number | null;
            garage: number | null;
            hasPool: boolean | null;
            listingStatus: string | null;
            price: import("@prisma/client/runtime/library").Decimal | null;
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
        };
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.RentalStatus;
        notes: string;
        snapshotTitle: string | null;
        snapshotImageUrl: string | null;
        snapshotOwnerName: string | null;
        snapshotOwnerEmail: string | null;
        snapshotOwnerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
        assetId: string | null;
        renterId: string;
    })[]>;
    findIncoming(req: any): Promise<({
        asset: {
            name: string;
            id: string;
            imageUrl: string;
            location: string;
        };
        renter: {
            email: string;
            fullName: string;
            id: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.RentalStatus;
        notes: string;
        snapshotTitle: string | null;
        snapshotImageUrl: string | null;
        snapshotOwnerName: string | null;
        snapshotOwnerEmail: string | null;
        snapshotOwnerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
        assetId: string | null;
        renterId: string;
    })[]>;
    findByOwner(req: any): Promise<({
        asset: {
            name: string;
            id: string;
            imageUrl: string;
            ownerId: string;
        };
        renter: {
            email: string;
            fullName: string;
            id: string;
            avatarUrl: string;
        };
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.RentalStatus;
        notes: string;
        snapshotTitle: string | null;
        snapshotImageUrl: string | null;
        snapshotOwnerName: string | null;
        snapshotOwnerEmail: string | null;
        snapshotOwnerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
        assetId: string | null;
        renterId: string;
    })[]>;
    findOne(id: string, req: any): Promise<{
        asset: {
            category: {
                id: string;
                name: string;
                slug: string;
                description: string;
                icon: string;
                createdAt: Date;
            };
            owner: {
                email: string;
                fullName: string;
                id: string;
                avatarUrl: string;
                phone: string;
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
            vehicleClass: string | null;
            cityMpg: number | null;
            highwayMpg: number | null;
            combinationMpg: number | null;
            cylinders: number | null;
            displacement: number | null;
            drive: string | null;
            propertyType: string | null;
            bedrooms: number | null;
            bathrooms: number | null;
            areaSqft: number | null;
            address: string | null;
            city: string | null;
            state: string | null;
            zipCode: string | null;
            yearBuilt: number | null;
            garage: number | null;
            hasPool: boolean | null;
            listingStatus: string | null;
            price: import("@prisma/client/runtime/library").Decimal | null;
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
        };
        renter: {
            email: string;
            fullName: string;
            id: string;
        };
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.RentalStatus;
        notes: string;
        snapshotTitle: string | null;
        snapshotImageUrl: string | null;
        snapshotOwnerName: string | null;
        snapshotOwnerEmail: string | null;
        snapshotOwnerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
        assetId: string | null;
        renterId: string;
    }>;
    updateStatus(id: string, req: any, dto: UpdateRentalStatusDto): Promise<{
        id: string;
        startDate: Date;
        endDate: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.RentalStatus;
        notes: string;
        snapshotTitle: string | null;
        snapshotImageUrl: string | null;
        snapshotOwnerName: string | null;
        snapshotOwnerEmail: string | null;
        snapshotOwnerPhone: string | null;
        createdAt: Date;
        updatedAt: Date;
        assetId: string | null;
        renterId: string;
    }>;
}
