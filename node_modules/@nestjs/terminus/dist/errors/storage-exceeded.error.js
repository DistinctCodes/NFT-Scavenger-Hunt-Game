"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageExceededError = void 0;
/* eslint-disable deprecation/deprecation */
const messages_constant_1 = require("./messages.constant");
const health_check_error_1 = require("../health-check/health-check.error");
/**
 * Error which gets thrown when the given storage threshold
 * has exceeded.
 * @publicApi
 *
 * @deprecated
 * This class has been deprecated and will be removed in the next major release.
 * Instead utilise the `HealthIndicatorService` to indicate the health of your health indicator.
 */
class StorageExceededError extends health_check_error_1.HealthCheckError {
    /**
     * Initializes the error
     *
     * @param {string} keyword The keyword (heap, rss, disk e.g.)
     * @param {any} cause The cause of the health check error
     *
     * @internal
     */
    constructor(keyword, cause) {
        super((0, messages_constant_1.STORAGE_EXCEEDED)(keyword), cause);
    }
}
exports.StorageExceededError = StorageExceededError;
//# sourceMappingURL=storage-exceeded.error.js.map