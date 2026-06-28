export declare class CreateRentalDto {
    assetId?: string;
    startDate: string;
    endDate: string;
    notes?: string;
    snapshotTitle?: string;
    snapshotImageUrl?: string;
    snapshotOwnerName?: string;
    snapshotOwnerEmail?: string;
    snapshotOwnerPhone?: string;
    snapshotDailyRate?: number;
    snapshotSecurityDeposit?: number;
}
export declare class UpdateRentalStatusDto {
    status: string;
}
