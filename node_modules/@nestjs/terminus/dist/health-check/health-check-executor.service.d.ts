import { type BeforeApplicationShutdown } from '@nestjs/common';
import { type HealthCheckResult } from './health-check-result.interface';
import { type HealthIndicatorFunction } from '../health-indicator';
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
export declare class HealthCheckExecutor implements BeforeApplicationShutdown {
    private isShuttingDown;
    /**
     * Executes the given health indicators.
     * Implementation for v6 compatibility.
     *
     * @throws {Error} All errors which are not inherited by the `HealthCheckError`-class
     *
     * @returns the result of given health indicators
     * @param healthIndicators The health indicators which should get executed
     */
    execute(healthIndicators: HealthIndicatorFunction[]): Promise<HealthCheckResult>;
    /**
     * @internal
     */
    beforeApplicationShutdown(): void;
    private executeHealthIndicators;
    private getSummary;
    private getResult;
}
