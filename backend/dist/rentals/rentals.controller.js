"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentalsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const rentals_service_1 = require("./rentals.service");
const rental_dto_1 = require("./dto/rental.dto");
const auth_guard_1 = require("../auth/guards/auth.guard");
let RentalsController = class RentalsController {
    constructor(service) {
        this.service = service;
    }
    create(req, dto) {
        return this.service.create(req.user.id, dto);
    }
    findMine(req) {
        return this.service.findMyRentals(req.user.id);
    }
    findIncoming(req) {
        return this.service.findIncomingRequests(req.user.id);
    }
    findByOwner(req) {
        const status = req.query?.status;
        return this.service.findByOwner(req.user.id, status);
    }
    findOne(id, req) {
        return this.service.findOne(id, req.user.id);
    }
    updateStatus(id, req, dto) {
        return this.service.updateStatus(id, req.user.id, dto);
    }
};
exports.RentalsController = RentalsController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new rental booking' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, rental_dto_1.CreateRentalDto]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all rentals for current user' }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "findMine", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, swagger_1.ApiOperation)({ summary: "Get incoming rental requests for owner's assets" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "findIncoming", null);
__decorate([
    (0, common_1.Get)('owner'),
    (0, swagger_1.ApiOperation)({ summary: "Get rentals for assets owned by current user" }),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "findByOwner", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single rental by ID' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    (0, swagger_1.ApiOperation)({ summary: 'Update rental status (cancel, complete)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Request)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, rental_dto_1.UpdateRentalStatusDto]),
    __metadata("design:returntype", void 0)
], RentalsController.prototype, "updateStatus", null);
exports.RentalsController = RentalsController = __decorate([
    (0, swagger_1.ApiTags)('rentals'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('rentals'),
    __metadata("design:paramtypes", [rentals_service_1.RentalsService])
], RentalsController);
//# sourceMappingURL=rentals.controller.js.map