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
var HealthCheckService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckService = void 0;
const common_1 = require("@nestjs/common");
const error_logger_provider_1 = require("./error-logger/error-logger.provider");
const health_check_executor_service_1 = require("./health-check-executor.service");
const logger_provider_1 = require("./logger/logger.provider");
/**
 * Handles Health Checks which can be used in
 * Controllers.
 */
let HealthCheckService = HealthCheckService_1 = class HealthCheckService {
    constructor(healthCheckExecutor, errorLogger, logger) {
        this.healthCheckExecutor = healthCheckExecutor;
        this.errorLogger = errorLogger;
        this.logger = logger;
        if (this.logger instanceof common_1.ConsoleLogger) {
            this.logger.setContext(HealthCheckService_1.name);
        }
    }
    /**
     * Checks the given health indicators
     *
     * ```typescript
     *
     * healthCheckService.check([
     *   () => this.http.pingCheck('google', 'https://google.com'),
     * ]);
     *
     *
     * ```
     * @param healthIndicators The health indicators which should be checked
     */
    check(healthIndicators) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.healthCheckExecutor.execute(healthIndicators);
            if (result.status === 'ok') {
                return result;
            }
            if (result.status === 'error') {
                const msg = this.errorLogger.getErrorMessage('Health Check has failed!', result.details);
                this.logger.error(msg);
            }
            throw new common_1.ServiceUnavailableException(result);
        });
    }
};
exports.HealthCheckService = HealthCheckService;
exports.HealthCheckService = HealthCheckService = HealthCheckService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(error_logger_provider_1.ERROR_LOGGER)),
    __param(2, (0, common_1.Inject)(logger_provider_1.TERMINUS_LOGGER)),
    __metadata("design:paramtypes", [health_check_executor_service_1.HealthCheckExecutor, Object, Object])
], HealthCheckService);
//# sourceMappingURL=health-check.service.js.map