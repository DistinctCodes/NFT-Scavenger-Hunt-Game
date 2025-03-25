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
exports.MikroOrmHealthIndicator = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const database_not_connected_error_1 = require("../../errors/database-not-connected.error");
const utils_1 = require("../../utils");
const health_indicator_service_1 = require("../health-indicator.service");
/**
 * The MikroOrmHealthIndicator contains health indicators
 * which are used for health checks related to MikroOrm
 *
 * @publicApi
 * @module TerminusModule
 */
let MikroOrmHealthIndicator = class MikroOrmHealthIndicator {
    constructor(moduleRef, healthIndicatorService) {
        this.moduleRef = moduleRef;
        this.healthIndicatorService = healthIndicatorService;
        this.checkDependantPackages();
    }
    checkDependantPackages() {
        (0, utils_1.checkPackages)(['@mikro-orm/nestjs', '@mikro-orm/core'], this.constructor.name);
    }
    /**
     * Returns the connection of the current DI context
     */
    getContextConnection() {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { MikroORM } = require('@mikro-orm/core');
        const mikro = this.moduleRef.get(MikroORM, { strict: false });
        const connection = mikro.em.getConnection();
        if (!connection) {
            return null;
        }
        return connection;
    }
    /**
     * Pings a mikro-orm connection
     *
     * @param connection The connection which the ping should get executed
     * @param timeout The timeout how long the ping should maximum take
     *
     */
    pingDb(connection, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            const checker = () => __awaiter(this, void 0, void 0, function* () {
                const isConnected = yield connection.isConnected();
                if (!isConnected) {
                    throw new database_not_connected_error_1.DatabaseNotConnectedError();
                }
            });
            return yield (0, utils_1.promiseTimeout)(timeout, checker());
        });
    }
    /**
     * Checks if responds in (default) 1000ms and
     * returns a result object corresponding to the result
     * @param key The key which will be used for the result object
     * @param options The options for the ping
     *
     * @example
     * MikroOrmHealthIndicator.pingCheck('database', { timeout: 1500 });
     */
    pingCheck(key_1) {
        return __awaiter(this, arguments, void 0, function* (key, options = {}) {
            this.checkDependantPackages();
            const check = this.healthIndicatorService.check(key);
            const timeout = options.timeout || 1000;
            const connection = options.connection || this.getContextConnection();
            if (!connection) {
                return check.down();
            }
            try {
                yield this.pingDb(connection, timeout);
            }
            catch (error) {
                // Check if the error is a timeout error
                if (error instanceof utils_1.TimeoutError) {
                    return check.down(`timeout of ${timeout}ms exceeded`);
                }
                if (error instanceof database_not_connected_error_1.DatabaseNotConnectedError) {
                    return check.down(error.message);
                }
                return check.down();
            }
            return check.up();
        });
    }
};
exports.MikroOrmHealthIndicator = MikroOrmHealthIndicator;
exports.MikroOrmHealthIndicator = MikroOrmHealthIndicator = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.TRANSIENT }),
    __metadata("design:paramtypes", [core_1.ModuleRef,
        health_indicator_service_1.HealthIndicatorService])
], MikroOrmHealthIndicator);
//# sourceMappingURL=mikro-orm.health.js.map