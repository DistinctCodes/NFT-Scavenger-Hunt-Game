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
exports.TypeOrmHealthIndicator = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const errors_1 = require("../../errors");
const utils_1 = require("../../utils");
const health_indicator_service_1 = require("../health-indicator.service");
/**
 * The TypeOrmHealthIndicator contains health indicators
 * which are used for health checks related to TypeOrm
 *
 * @publicApi
 * @module TerminusModule
 */
let TypeOrmHealthIndicator = class TypeOrmHealthIndicator {
    constructor(moduleRef, healthIndicatorService) {
        this.moduleRef = moduleRef;
        this.healthIndicatorService = healthIndicatorService;
        this.checkDependantPackages();
    }
    /**
     * Checks if the dependant packages are present
     */
    checkDependantPackages() {
        (0, utils_1.checkPackages)(['@nestjs/typeorm', 'typeorm'], this.constructor.name);
    }
    /**
     * Returns the connection of the current DI context
     */
    getContextConnection() {
        const { getDataSourceToken } = 
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        require('@nestjs/typeorm/dist/common/typeorm.utils');
        try {
            return this.moduleRef.get(getDataSourceToken(), {
                strict: false,
            });
        }
        catch (err) {
            return null;
        }
    }
    /**
     * Pings a typeorm connection
     *
     * @param connection The connection which the ping should get executed
     * @param timeout The timeout how long the ping should maximum take
     *
     */
    pingDb(connection, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            let check;
            switch (connection.options.type) {
                case 'mongodb':
                    check = connection.driver.queryRunner.databaseConnection
                        .db()
                        .command({ ping: 1 });
                    break;
                case 'oracle':
                    check = connection.query('SELECT 1 FROM DUAL');
                    break;
                case 'sap':
                    check = connection.query('SELECT now() FROM dummy');
                    break;
                default:
                    check = connection.query('SELECT 1');
                    break;
            }
            return yield (0, utils_1.promiseTimeout)(timeout, check);
        });
    }
    /**
     * Checks if responds in (default) 1000ms and
     * returns a result object corresponding to the result
     * @param key The key which will be used for the result object
     * @param options The options for the ping
     *
     * @example
     * typeOrmHealthIndicator.pingCheck('database', { timeout: 1500 });
     */
    pingCheck(key_1) {
        return __awaiter(this, arguments, void 0, function* (key, options = {}) {
            const check = this.healthIndicatorService.check(key);
            this.checkDependantPackages();
            const connection = options.connection || this.getContextConnection();
            const timeout = options.timeout || 1000;
            if (!connection) {
                return check.down('Connection provider not found in application context');
            }
            try {
                yield this.pingDb(connection, timeout);
            }
            catch (err) {
                if (err instanceof utils_1.TimeoutError) {
                    return check.down(`timeout of ${timeout}ms exceeded`);
                }
                if (err instanceof errors_1.MongoConnectionError) {
                    return check.down(err.message);
                }
                return check.down();
            }
            return check.up();
        });
    }
};
exports.TypeOrmHealthIndicator = TypeOrmHealthIndicator;
exports.TypeOrmHealthIndicator = TypeOrmHealthIndicator = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.TRANSIENT }),
    __metadata("design:paramtypes", [core_1.ModuleRef,
        health_indicator_service_1.HealthIndicatorService])
], TypeOrmHealthIndicator);
//# sourceMappingURL=typeorm.health.js.map