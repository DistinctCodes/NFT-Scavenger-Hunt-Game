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
exports.MicroserviceHealthIndicator = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../../utils");
const health_indicator_service_1 = require("../health-indicator.service");
/**
 * The MicroserviceHealthIndicator is a health indicators
 * which is used for health checks related to microservices
 *
 * @publicApi
 * @module TerminusModule
 */
let MicroserviceHealthIndicator = class MicroserviceHealthIndicator {
    constructor(healthIndicatorService) {
        this.healthIndicatorService = healthIndicatorService;
        this.checkDependantPackages();
    }
    /**
     * Checks if the dependant packages are present
     */
    checkDependantPackages() {
        this.nestJsMicroservices = (0, utils_1.checkPackages)(['@nestjs/microservices'], this.constructor.name)[0];
    }
    pingMicroservice(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = this.nestJsMicroservices.ClientProxyFactory.create(options);
            const checkConnection = () => __awaiter(this, void 0, void 0, function* () {
                yield client.connect();
                yield client.close();
            });
            return yield checkConnection();
        });
    }
    /**
     * Checks if the given microservice is up
     * @param key The key which will be used for the result object
     * @param options The options of the microservice
     *
     * @throws {HealthCheckError} If the microservice is not reachable
     *
     * @example
     * microservice.pingCheck<TcpClientOptions>('tcp', {
     *   transport: Transport.TCP,
     *   options: { host: 'localhost', port: 3001 },
     * })
     */
    pingCheck(key, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const check = this.healthIndicatorService.check(key);
            const timeout = options.timeout || 1000;
            if (options.transport === this.nestJsMicroservices.Transport.KAFKA) {
                options.options = Object.assign({ 
                    // We need to set the producerOnlyMode to true in order to speed
                    // up the connection process. https://github.com/nestjs/terminus/issues/1690
                    producerOnlyMode: true }, options.options);
            }
            try {
                yield (0, utils_1.promiseTimeout)(timeout, this.pingMicroservice(options));
            }
            catch (err) {
                if (err instanceof utils_1.TimeoutError) {
                    return check.down(`timeout of ${timeout}ms exceeded`);
                }
                if ((0, utils_1.isError)(err)) {
                    return check.down(err.message);
                }
                return check.down(`${key} is not available`);
            }
            return check.up();
        });
    }
};
exports.MicroserviceHealthIndicator = MicroserviceHealthIndicator;
exports.MicroserviceHealthIndicator = MicroserviceHealthIndicator = __decorate([
    (0, common_1.Injectable)({ scope: common_1.Scope.TRANSIENT }),
    __metadata("design:paramtypes", [health_indicator_service_1.HealthIndicatorService])
], MicroserviceHealthIndicator);
//# sourceMappingURL=microservice.health.js.map