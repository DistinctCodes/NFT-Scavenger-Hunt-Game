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
exports.MemoryHealthIndicator = void 0;
const common_1 = require("@nestjs/common");
const messages_constant_1 = require("../../errors/messages.constant");
const health_indicator_service_1 = require("../health-indicator.service");
/**
 * The MemoryHealthIndicator contains checks which are related
 * to the memory storage of the current running machine
 *
 * @publicApi
 * @module TerminusModule
 */
let MemoryHealthIndicator = class MemoryHealthIndicator {
    constructor(healthIndicatorService) {
        this.healthIndicatorService = healthIndicatorService;
    }
    /**
     * Checks the heap space and returns the status
     *
     * @param key The key which will be used for the result object
     * @param options The options of the `MemoryHealthIndicator`
     *
     * @throws {StorageExceededError} In case the heap has exceeded the given threshold
     *
     *
     * @returns {Promise<HealthIndicatorResult>} The result of the health indicator check
     *
     * @example
     * // The process should not use more than 150MB memory
     * memoryHealthIndicator.checkHeap('memory_heap', 150 * 1024 * 1024);
     */
    checkHeap(key, heapUsedThreshold) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = this.healthIndicatorService.check(key);
            const { heapUsed } = process.memoryUsage();
            if (heapUsedThreshold < heapUsed) {
                return check.down((0, messages_constant_1.STORAGE_EXCEEDED)('heap'));
            }
            return check.up();
        });
    }
    /**
     * Checks the rss space and returns the status
     *
     * @param key The key which will be used for the result object
     * @param options The options of the `MemoryHealthIndicator`
     *
     * @throws {StorageExceededError} In case the rss has exceeded the given threshold
     *
     * @returns {Promise<HealthIndicatorResult>} The result of the health indicator check
     *
     *  @example
     * // The process should not have more than 150MB allocated
     * memoryHealthIndicator.checkRSS('memory_rss', 150 * 1024 * 1024);
     */
    checkRSS(key, rssThreshold) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = this.healthIndicatorService.check(key);
            const { rss } = process.memoryUsage();
            if (rssThreshold < rss) {
                return check.down((0, messages_constant_1.STORAGE_EXCEEDED)('rss'));
            }
            return check.up();
        });
    }
};
exports.MemoryHealthIndicator = MemoryHealthIndicator;
exports.MemoryHealthIndicator = MemoryHealthIndicator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [health_indicator_service_1.HealthIndicatorService])
], MemoryHealthIndicator);
//# sourceMappingURL=memory.health.js.map