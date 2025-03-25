"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthIndicatorSession = exports.HealthIndicatorService = void 0;
const common_1 = require("@nestjs/common");
/**
 * Helper service which can be used to create health indicator results
 * @publicApi
 */
let HealthIndicatorService = class HealthIndicatorService {
    check(key) {
        return new HealthIndicatorSession(key);
    }
};
exports.HealthIndicatorService = HealthIndicatorService;
exports.HealthIndicatorService = HealthIndicatorService = __decorate([
    (0, common_1.Injectable)()
], HealthIndicatorService);
/**
 * Indicate the health of a health indicator with the given key
 *
 * @publicApi
 */
class HealthIndicatorSession {
    constructor(key) {
        this.key = key;
    }
    down(data) {
        let additionalData = {};
        if (typeof data === 'string') {
            additionalData = { message: data };
        }
        else if (typeof data === 'object') {
            additionalData = data;
        }
        const detail = Object.assign({ status: 'down' }, additionalData);
        return {
            [this.key]: detail,
            // TypeScript does not infer this.key as Key correctly.
        };
    }
    up(data) {
        let additionalData = {};
        if (typeof data === 'string') {
            additionalData = { message: data };
        }
        else if (typeof data === 'object') {
            additionalData = data;
        }
        const detail = Object.assign({ status: 'up' }, additionalData);
        return {
            [this.key]: detail,
            // TypeScript does not infer this.key as Key correctly.
        };
    }
}
exports.HealthIndicatorSession = HealthIndicatorSession;
//# sourceMappingURL=health-indicator.service.js.map