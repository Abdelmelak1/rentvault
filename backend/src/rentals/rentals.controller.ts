import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RentalsService } from './rentals.service';
import { CreateRentalDto, UpdateRentalStatusDto } from './dto/rental.dto';
import { JwtAuthGuard } from '../auth/guards/auth.guard';

@ApiTags('rentals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('rentals')
export class RentalsController {
  constructor(private service: RentalsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new rental booking' })
  create(@Request() req, @Body() dto: CreateRentalDto) {
    return this.service.create(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rentals for current user' })
  findMine(@Request() req) {
    return this.service.findMyRentals(req.user.id);
  }

  @Get('requests')
  @ApiOperation({ summary: "Get incoming rental requests for owner's assets" })
  findIncoming(@Request() req) {
    return this.service.findIncomingRequests(req.user.id);
  }

  @Get('owner')
  @ApiOperation({ summary: "Get rentals for assets owned by current user" })
  findByOwner(@Request() req) {
    const status = req.query?.status as string | undefined;
    return this.service.findByOwner(req.user.id, status);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single rental by ID' })
  findOne(@Param('id') id: string, @Request() req) {
    return this.service.findOne(id, req.user.id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update rental status (cancel, complete)' })
  updateStatus(
    @Param('id') id: string,
    @Request() req,
    @Body() dto: UpdateRentalStatusDto,
  ) {
    return this.service.updateStatus(id, req.user.id, dto);
  }
}
