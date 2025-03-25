"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthIndicator = void 0;
/**
 * @deprecated
 * **This class has been deprecated and will be removed in the next major release.**
 * Instead utilise the `HealthIndicatorService` to indicate the health of your health indicator.
 *
 * @see {@link https://docs.nestjs.com/migration-guide#terminus-module|Migration Guide}
 *
 * @description
 * Represents an abstract health indicator
 * with common functionalities
 *
 * A custom HealthIndicator should inherit the `HealthIndicator` class.
 *
 * @example
 * ```typescript
 * class MyHealthIndicator extends HealthIndicator {
 *   public check(key: string) {
 *     // Replace with the actual check
 *     const isHealthy = true;
 *     // Returns { [key]: { status: 'up', message: 'Up and running' } }
 *     return super.getStatus(key, isHealthy, { message: 'Up and running' });
 *   }
 * }
 * ```
 * @publicApi
 */
class HealthIndicator {
    /**
     * Generates the health indicator result object
     * @param key The key which will be used as key for the result object
     * @param isHealthy Whether the health indicator is healthy
     * @param data Additional data which will get appended to the result object
     */
    getStatus(key, isHealthy, data) {
        return {
            [key]: Object.assign({ status: isHealthy ? 'up' : 'down' }, data),
        };
    }
}
exports.HealthIndicator = HealthIndicator;
//# sourceMappingURL=health-indicator.js.map