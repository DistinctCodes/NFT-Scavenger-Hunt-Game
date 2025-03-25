"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.HealthCheckExecutor = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../utils");
/**
 * Takes care of the execution of health indicators.
 *
 * @description
 * The HealthCheckExecutor is standalone, so it can be used for
 * the legacy TerminusBootstrapService and the HealthCheckService.
 *
 * On top of that, the HealthCheckExecutor uses the `BeforeApplicationShutdown`
 * hook, therefore it must implement the `beforeApplicationShutdown`
 * method as public. We do not want to expose that
 * to the end-user.
 *
 * @internal
 */
let HealthCheckExecutor = class HealthCheckExecutor {
    constructor() {
        this.isShuttingDown = false;
    }
    /**
     * Executes the given health indicators.
     * Implementation for v6 compatibility.
     *
     * @throws {Error} All errors which are not inherited by the `HealthCheckError`-class
     *
     * @returns the result of given health indicators
     * @param healthIndicators The health indicators which should get executed
     */
    execute(healthIndicators) {
        return __awaiter(this, void 0, void 0, function* () {
            const { results, errors } = yield this.executeHealthIndicators(healthIndicators);
            return this.getResult(results, errors);
        });
    }
    /**
     * @internal
     */
    beforeApplicationShutdown() {
        this.isShuttingDown = true;
    }
    executeHealthIndicators(healthIndicators) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = [];
            const errors = [];
            const result = yield Promise.allSettled(healthIndicators.map((h) => __awaiter(this, void 0, void 0, function* () { return h(); })));
            result.forEach((res) => {
                if (res.status === 'fulfilled') {
                    Object.entries(res.value).forEach(([key, value]) => {
                        if (value.status === 'up') {
                            results.push({ [key]: value });
                        }
                        else if (value.status === 'down') {
                            errors.push({ [key]: value });
                        }
                    });
                }
                else {
                    const error = res.reason;
                    // Is not an expected error. Throw further!
                    if (!(0, utils_1.isHealthCheckError)(error)) {
                        throw error;
                    }
                    // eslint-disable-next-line deprecation/deprecation
                    errors.push(error.causes);
                }
            });
            return { results, errors };
        });
    }
    getSummary(results) {
        return results.reduce((previous, current) => Object.assign(previous, current), {});
    }
    getResult(results, errors) {
        const infoErrorCombined = results.concat(errors);
        const info = this.getSummary(results);
        const error = this.getSummary(errors);
        const details = this.getSummary(infoErrorCombined);
        let status = 'ok';
        status = errors.length > 0 ? 'error' : status;
        status = this.isShuttingDown ? 'shutting_down' : status;
        return {
            status,
            info,
            error,
            details,
        };
    }
};
exports.HealthCheckExecutor = HealthCheckExecutor;
exports.HealthCheckExecutor = HealthCheckExecutor = __decorate([
    (0, common_1.Injectable)()
], HealthCheckExecutor);
//# sourceMappingURL=health-check-executor.service.js.map