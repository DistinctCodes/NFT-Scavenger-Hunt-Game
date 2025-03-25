"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnhealthyResponseCodeError = void 0;
/* eslint-disable deprecation/deprecation */
const messages_constant_1 = require("./messages.constant");
const health_check_error_1 = require("../health-check/health-check.error");
/**
 * Error which gets thrown when the terminus client receives
 * an unhealthy response code from the server.
 * @publicApi
 *
 * @deprecated
 * This class has been deprecated and will be removed in the next major release.
 * Instead utilise the `HealthIndicatorService` to indicate the health of your health indicator.
 */
class UnhealthyResponseCodeError extends health_check_error_1.HealthCheckError {
    /**
     * Initializes the error
     *
     * @param {string | number} responseCode The response code
     * @param {any} cause The cause of the health check error
     *
     * @internal
     */
    constructor(responseCode, cause) {
        super((0, messages_constant_1.UNHEALTHY_RESPONSE_CODE)(responseCode), cause);
    }
}
exports.UnhealthyResponseCodeError = UnhealthyResponseCodeError;
//# sourceMappingURL=unhealthy-response-code.error.js.map