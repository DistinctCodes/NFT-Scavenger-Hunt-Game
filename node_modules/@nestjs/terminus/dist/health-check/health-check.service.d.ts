import { LoggerService } from '@nestjs/common';
import { ErrorLogger } from './error-logger/error-logger.interface';
import { HealthCheckExecutor } from './health-check-executor.service';
import { type HealthCheckResult } from './health-check-result.interface';
import { type HealthIndicatorFunction } from '../health-indicator';
/**
 * Handles Health Checks which can be used in
 * Controllers.
 */
export declare class HealthCheckService {
    private readonly healthCheckExecutor;
    private readonly errorLogger;
    private readonly logger;
    constructor(healthCheckExecutor: HealthCheckExecutor, errorLogger: ErrorLogger, logger: LoggerService);
    /**
     * Checks the given health indicators
     *
     * ```typescript
     *
     * healthCheckService.check([
     *   () => this.http.pingCheck('google', 'https://google.com'),
     * ]);
     *
     *
     * ```
     * @param healthIndicators The health indicators which should be checked
     */
    check(healthIndicators: HealthIndicatorFunction[]): Promise<HealthCheckResult>;
}
