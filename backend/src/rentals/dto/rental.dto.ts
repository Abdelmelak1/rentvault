import { IsString, IsDateString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRentalDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assetId?: string;

  @ApiProperty({ example: '2026-06-20' })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: '2026-06-25' })
  @IsDateString()
  endDate: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  // Optional snapshot fields when requesting a non-persisted/catalog item
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  snapshotTitle?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  snapshotImageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  snapshotOwnerName?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  snapshotOwnerEmail?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  snapshotOwnerPhone?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  snapshotDailyRate?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  snapshotSecurityDeposit?: number;
}

export class UpdateRentalStatusDto {
  @ApiProperty({ enum: ['active', 'completed', 'cancelled'] })
  @IsString()
  status: string;
}
