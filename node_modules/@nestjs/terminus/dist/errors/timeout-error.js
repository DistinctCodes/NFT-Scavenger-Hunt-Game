"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeoutError = void 0;
/* eslint-disable deprecation/deprecation */
const messages_constant_1 = require("./messages.constant");
const health_check_error_1 = require("../health-check/health-check.error");
/**
 * Gets thrown when the timeout of the health check exceeds
 * @publicApi
 *
 * @deprecated
 * This class has been deprecated and will be removed in the next major release.
 * Instead utilise the `HealthIndicatorService` to indicate the health of your health indicator.
 */
class TimeoutError extends health_check_error_1.HealthCheckError {
    /**
     * Initializes the error
     * @param {number} timeout The given timeout in ms
     * @param {any} cause The cause of the health check error
     *
     * @internal
     */
    constructor(timeout, cause) {
        super((0, messages_constant_1.TIMEOUT_EXCEEDED)(timeout), cause);
    }
}
exports.TimeoutError = TimeoutError;
//# sourceMappingURL=timeout-error.js.map