export declare class CreateAssetDto {
    name: string;
    description?: string;
    categoryId?: string;
    imageUrl?: string;
    make?: string;
    model?: string;
    year?: number;
    color?: string;
    mileage?: number;
    transmission?: string;
    fuelType?: string;
    seats?: number;
    images?: string[];
    dailyRate?: number;
    weeklyRate?: number;
    monthlyRate?: number;
    securityDeposit?: number;
    condition?: string;
    status?: string;
    location?: string;
}
export declare class UpdateAssetDto extends CreateAssetDto {
}
export declare class AssetQueryDto {
    status?: string;
    categorySlug?: string;
    search?: string;
}
