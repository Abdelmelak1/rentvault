import {
  IsString,
  IsOptional,
  IsNumber,
  IsEnum,
  IsArray,
  IsInt,
  Min,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateAssetDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  make?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  model?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  year?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  color?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  mileage?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  transmission?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fuelType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  seats?: number;

  @ApiProperty({ required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiProperty({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  dailyRate?: number;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  weeklyRate?: number;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  monthlyRate?: number;

  @ApiProperty({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  securityDeposit?: number;

  @ApiProperty({ enum: ['excellent', 'good', 'fair', 'poor'], default: 'good' })
  @IsOptional()
  @IsEnum(['excellent', 'good', 'fair', 'poor'])
  condition?: string;

  @ApiProperty({ enum: ['available', 'maintenance', 'retired'], default: 'available' })
  @IsOptional()
  @IsEnum(['available', 'maintenance', 'retired'])
  status?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;
}

export class UpdateAssetDto extends CreateAssetDto {}

export class AssetQueryDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsString()
  categorySlug?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
