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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRPCHealthIndicator = void 0;
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const utils_1 = require("../../utils");
const health_indicator_service_1 = require("../health-indicator.service");
/**
 * The status of the request service
 * @internal
 */
var ServingStatus;
(function (ServingStatus) {
    ServingStatus[ServingStatus["UNKNOWN"] = 0] = "UNKNOWN";
    ServingStatus[ServingStatus["SERVING"] = 1] = "SERVING";
    ServingStatus[ServingStatus["NOT_SERVING"] = 2] = "NOT_SERVING";
})(ServingStatus || (ServingStatus = {}));
/**
 * The `GRPCHealthIndicator` is used for health checks
 * related to GRPC
 *
 * @publicApi
 * @module TerminusModule
 */
let GRPCHealthIndicator = class GRPCHealthIndicator {
    /**
     * Initializes the health indicator
     */
    constructor(healthIndicatorService) {
        this.healthIndicatorService = healthIndicatorService;
        /**
         * A cache of open channels for the health indicator
         * This is used to prevent opening new channels for every health check
         */
        this.openChannels = new Map();
        this.checkDependantPackages();
    }
    /**
     * Checks if the dependant packages are present
     */
    checkDependantPackages() {
        this.nestJsMicroservices = (0, utils_1.checkPackages)(['@nestjs/microservices', '@grpc/grpc-js', '@grpc/proto-loader'], this.constructor.name)[0];
    }
    /**
     * Creates a GRPC client from the given options
     * @private
     */
    createClient(options) {
        const { 
        // Remove the options which are not needed for the client
        timeout: _t, healthServiceName: _hS, healthServiceCheck: _hSC } = options, grpcOptions = __rest(options, ["timeout", "healthServiceName", "healthServiceCheck"]);
        return this.nestJsMicroservices.ClientProxyFactory.create({
            transport: 4,
            options: grpcOptions,
        });
    }
    getHealthService(service, settings) {
        if (this.openChannels.has(service)) {
            return this.openChannels.get(service);
        }
        const client = this.createClient(settings);
        const healthService = client.getService(settings.healthServiceName);
        this.openChannels.set(service, healthService);
        return healthService;
    }
    /**
     * Checks if the given service is up using the standard health check
     * specification of GRPC.
     *
     * https://github.com/grpc/grpc/blob/master/doc/health-checking.md
     *
     * @param {string} key The key which will be used for the result object
     * @param {string} service The service which should be checked
     * @param {CheckGRPCOptions} [options] Configuration for the request
     *
     * @example
     * grpc.checkService<GrpcOptions>('hero_service', 'hero.health.v1')
     *
     * @example
     * // Change the timeout
     * grpc.checkService<GrpcOptions>('hero_service', 'hero.health.v1', { timeout: 300 })
     *
     * @example
     * // You can customize the health check
     * // by giving these options. Nonetheless it is still seen
     * // as best practice to implement the recommended GRPC specs
     * grpc.checkService<GrpcOptions>('hero_service', 'hero.health.v1', {
     *   timeout: 500,
     *   package: 'grpc.health.v2',
     *   protoPath: join(__dirname, './protos/my-custom-health.v1'),
     *   // The name of the service you need for the health check
     *   healthServiceName: 'Health',
     *   // Your custom function which checks the service
     *   healthServiceCheck: (healthService: any, service: string) =>
     *     healthService.check({ service }).toPromise(),
     * })
     *
     * @throws {HealthCheckError} Gets thrown in case a health check failed
     * @throws {TimeoutError} Gets thrown in case a health check exceeded the given timeout
     * @throws {UnhealthyResponseCodeError} Gets thrown in case the received response is unhealthy
     */
    checkService(key_1, service_1) {
        return __awaiter(this, arguments, void 0, function* (key, service, options = {}) {
            const check = this.healthIndicatorService.check(key);
            const defaultOptions = {
                package: 'grpc.health.v1',
                protoPath: (0, path_1.join)(__dirname, './protos/health.proto'),
                healthServiceCheck: (healthService, service) => 
                // eslint-disable-next-line deprecation/deprecation
                healthService.check({ service }).toPromise(),
                timeout: 1000,
                healthServiceName: 'Health',
            };
            const settings = Object.assign(Object.assign({}, defaultOptions), options);
            let healthService;
            try {
                healthService = this.getHealthService(service, settings);
            }
            catch (err) {
                if (err instanceof TypeError) {
                    throw err;
                }
                if ((0, utils_1.isError)(err)) {
                    return check.down(err.message);
                }
                if (typeof err === 'string') {
                    return check.down(err);
                }
                return check.down();
            }
            let response;
            try {
                response = yield (0, utils_1.promiseTimeout)(settings.timeout, settings.healthServiceCheck(healthService, service));
            }
            catch (err) {
                if (err instanceof utils_1.TimeoutError) {
                    return check.down(`timeout of ${settings.timeout}ms exceeded`);
                }
                if ((0, utils_1.isError)(err)) {
                    return check.down(err.message);
                }
                if (typeof err === 'string') {
                    return check.down(err);
                }
                return check.down();
            }
            const isHealthy = response.status === ServingStatus.SERVING;
            if (!isHealthy) {
                return check.down({
                    statusCode: response.status,
                    servingStatus: ServingStatus[response.status],
                });
            }
            return check.up({
                statusCode: response.status,
                servingStatus: ServingStatus[response.status],
            });
        });
    }
};
exports.GRPCHealthIndicator = GRPCHealthIndicator;
exports.GRPCHealthIndicator = GRPCHealthIndicator = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.TRANSIENT }),
    __metadata("design:paramtypes", [health_indicator_service_1.HealthIndicatorService])
], GRPCHealthIndicator);
//# sourceMappingURL=grpc.health.js.map