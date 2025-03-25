"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectionNotFoundError = void 0;
/* eslint-disable deprecation/deprecation */
const messages_constant_1 = require("./messages.constant");
const health_check_error_1 = require("../health-check/health-check.error");
/**
 * Error which gets thrown when the connection
 * instance was not found in the application context
 * @publicApi
 *
 * @deprecated
 * This class has been deprecated and will be removed in the next major release.
 * Instead utilise the `HealthIndicatorService` to indicate the health of your health indicator.
 *
 */
class ConnectionNotFoundError extends health_check_error_1.HealthCheckError {
    /**
     * Initializes the error
     * @param {any} cause The cause of the health check error
     *
     * @internal
     */
    constructor(cause) {
        super(messages_constant_1.CONNECTION_NOT_FOUND, cause);
    }
}
exports.ConnectionNotFoundError = ConnectionNotFoundError;
//# sourceMappingURL=connection-not-found.error.js.map