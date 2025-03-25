"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckError = void 0;
/**
 * @deprecated
 * **This class has been deprecated and will be removed in the next major release.**
 * Instead utilise the `HealthIndicatorService` to indicate the health of your health indicator.
 *
 * @see {@link https://docs.nestjs.com/migration-guide#terminus-module|Migration Guide}
 */
class HealthCheckError extends Error {
    constructor(message, causes) {
        super(message);
        this.isHealthCheckError = true;
        this.causes = causes;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HealthCheckError = HealthCheckError;
//# sourceMappingURL=health-check.error.js.map