import { RentalsService } from './rentals.service';
import { CreateRentalDto, UpdateRentalStatusDto } from './dto/rental.dto';
export declare class RentalsController {
    private service;
    constructor(service: RentalsService);
    create(req: any, dto: CreateRentalDto): Promise<{
        asset: {
            name: string;
            imageUrl: string;
            dailyRate: import("@prisma/client/runtime/library").Decimal;
        };
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.RentalStatus;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
        assetId: string;
        renterId: string;
    }>;
    findMine(req: any): Promise<({
        asset: {
            category: {
                slug: string;
            };
            name: string;
            description: string;
            state: string;
            imageUrl: string;
            make: string;
            model: string;
            year: number;
            propertyType: string;
            bedrooms: number;
            bathrooms: number;
            address: string;
            city: string;
            mileage: number;
            transmission: string;
            fuelType: string;
            seats: number;
            dailyRate: import("@prisma/client/runtime/library").Decimal;
            condition: import(".prisma/client").$Enums.Condition;
            location: string;
        };
    } & {
        id: string;
        startDate: Date;
        endDate: Date;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        securityDeposit: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.RentalStatus;
        notes: string;
        createdAt: Date;
        updatedAt: Date;
        assetId: string;
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
        createdAt: Date;
        updatedAt: Date;
        assetId: string;
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
        createdAt: Date;
        updatedAt: Date;
        assetId: string;
        renterId: string;
    }>;
}
