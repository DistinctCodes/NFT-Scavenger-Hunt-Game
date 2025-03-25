import { HealthCheckError } from '../health-check/health-check.error';
/**
 * Gets thrown when the timeout of the health check exceeds
 * @publicApi
 *
 * @deprecated
 * This class has been deprecated and will be removed in the next major release.
 * Instead utilise the `HealthIndicatorService` to indicate the health of your health indicator.
 */
export declare class TimeoutError extends HealthCheckError {
    /**
     * Initializes the error
     * @param {number} timeout The given timeout in ms
     * @param {any} cause The cause of the health check error
     *
     * @internal
     */
    constructor(timeout: number, cause: any);
}
