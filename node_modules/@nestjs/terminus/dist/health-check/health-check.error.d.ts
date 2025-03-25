/**
 * @deprecated
 * **This class has been deprecated and will be removed in the next major release.**
 * Instead utilise the `HealthIndicatorService` to indicate the health of your health indicator.
 *
 * @see {@link https://docs.nestjs.com/migration-guide#terminus-module|Migration Guide}
 */
export declare class HealthCheckError extends Error {
    causes: any;
    isHealthCheckError: boolean;
    constructor(message: string, causes: any);
}
