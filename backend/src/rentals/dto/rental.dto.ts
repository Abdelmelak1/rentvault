import { IsString, IsDateString, IsOptional, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreateRentalDto {
  @ApiProperty()
  @IsString()
  assetId: string;

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
}

export class UpdateRentalStatusDto {
  @ApiProperty({ enum: ['active', 'completed', 'cancelled'] })
  @IsString()
  status: string;
}
