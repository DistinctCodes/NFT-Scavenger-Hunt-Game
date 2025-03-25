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
exports.PrismaHealthIndicator = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../../utils");
const health_indicator_service_1 = require("../health-indicator.service");
/**
 * The PrismaHealthIndicator contains health indicators
 * which are used for health checks related to Prisma
 *
 * @publicApi
 * @module TerminusModule
 */
let PrismaHealthIndicator = class PrismaHealthIndicator {
    constructor(healthIndicatorService) {
        this.healthIndicatorService = healthIndicatorService;
    }
    pingDb(timeout, prismaClientSQLOrMongo) {
        return __awaiter(this, void 0, void 0, function* () {
            // The prisma client generates two different typescript types for different databases
            // but inside they've the same methods
            // But they will fail when using a document method on sql database, that's why we do the try catch down below
            const prismaClient = prismaClientSQLOrMongo;
            try {
                yield (0, utils_1.promiseTimeout)(timeout, prismaClient.$runCommandRaw({ ping: 1 }));
            }
            catch (error) {
                if (error instanceof Error &&
                    error.toString().includes('Use the mongodb provider')) {
                    yield (0, utils_1.promiseTimeout)(timeout, prismaClient.$queryRawUnsafe('SELECT 1'));
                    return;
                }
                throw error;
            }
        });
    }
    /**
     * Checks if the Prisma responds in (default) 1000ms and
     * returns a result object corresponding to the result
     *
     * @param key The key which will be used for the result object
     * @param prismaClient PrismaClient
     * @param options The options for the ping
     */
    pingCheck(key_1, prismaClient_1) {
        return __awaiter(this, arguments, void 0, function* (key, prismaClient, options = {}) {
            const check = this.healthIndicatorService.check(key);
            const timeout = options.timeout || 1000;
            try {
                yield this.pingDb(timeout, prismaClient);
            }
            catch (error) {
                if (error instanceof utils_1.TimeoutError) {
                    return check.down(`timeout of ${timeout}ms exceeded`);
                }
                return check.down();
            }
            return check.up();
        });
    }
};
exports.PrismaHealthIndicator = PrismaHealthIndicator;
exports.PrismaHealthIndicator = PrismaHealthIndicator = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [health_indicator_service_1.HealthIndicatorService])
], PrismaHealthIndicator);
//# sourceMappingURL=prisma.health.js.map