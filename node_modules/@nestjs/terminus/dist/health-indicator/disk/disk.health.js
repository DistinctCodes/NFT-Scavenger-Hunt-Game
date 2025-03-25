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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiskHealthIndicator = void 0;
const common_1 = require("@nestjs/common");
const shared_utils_1 = require("@nestjs/common/utils/shared.utils");
const messages_constant_1 = require("../../errors/messages.constant");
const terminus_constants_1 = require("../../terminus.constants");
const health_indicator_service_1 = require("../health-indicator.service");
/**
 * The DiskHealthIndicator contains checks which are related
 * to the disk storage of the current running machine
 *
 * @publicApi
 * @module TerminusModule
 */
let DiskHealthIndicator = class DiskHealthIndicator {
    constructor(checkDiskSpace, healthIndicatorService) {
        this.checkDiskSpace = checkDiskSpace;
        this.healthIndicatorService = healthIndicatorService;
    }
    /**
     * Checks if the given option has the property the `thresholdPercent` attribute
     *
     * @param {DiskHealthIndicatorOptions} options The options of the `DiskHealthIndicator`
     *
     * @private
     *
     * @returns {boolean} whether given option has the property the `thresholdPercent` attribute
     */
    isOptionThresholdPercent(options) {
        return !(0, shared_utils_1.isNil)(options.thresholdPercent);
    }
    /**
     * Checks if the size of the given size has exceeded the
     * given threshold
     *
     * @param key The key which will be used for the result object
     *
     * @throws {HealthCheckError} In case the health indicator failed
     * @throws {StorageExceededError} In case the disk storage has exceeded the given threshold
     *
     * @returns {Promise<HealthIndicatorResult>} The result of the health indicator check
     *
     * @example
     * // The used disk storage should not exceed 250 GB
     * diskHealthIndicator.checkStorage('storage', { threshold: 250 * 1024 * 1024 * 1024, path: '/' });
     * @example
     * // The used disk storage should not exceed 50% of the full disk size
     * diskHealthIndicator.checkStorage('storage', { thresholdPercent: 0.5, path: 'C:\\' });
     */
    checkStorage(key, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = this.healthIndicatorService.check(key);
            const { free, size } = yield this.checkDiskSpace(options.path);
            const used = size - free;
            // Prevent division by zero
            if (isNaN(size) || size === 0) {
                return check.down((0, messages_constant_1.STORAGE_EXCEEDED)('disk storage'));
            }
            let isHealthy = false;
            if (this.isOptionThresholdPercent(options)) {
                isHealthy = options.thresholdPercent >= used / size;
            }
            else {
                isHealthy = options.threshold >= used;
            }
            if (!isHealthy) {
                return check.down((0, messages_constant_1.STORAGE_EXCEEDED)('disk storage'));
            }
            return check.up();
        });
    }
};
exports.DiskHealthIndicator = DiskHealthIndicator;
exports.DiskHealthIndicator = DiskHealthIndicator = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(terminus_constants_1.CHECK_DISK_SPACE_LIB)),
    __metadata("design:paramtypes", [Function, health_indicator_service_1.HealthIndicatorService])
], DiskHealthIndicator);
//# sourceMappingURL=disk.health.js.map