import { ModuleRef } from '@nestjs/core';
import { type HealthIndicatorResult } from '../..';
import { HealthIndicatorService } from '../health-indicator.service';
export interface SequelizePingCheckSettings {
    /**
     * The connection which the ping check should get executed
     */
    connection?: any;
    /**
     * The amount of time the check should require in ms
     */
    timeout?: number;
}
/**
 * The SequelizeHealthIndicator contains health indicators
 * which are used for health checks related to Sequelize
 *
 * @publicApi
 * @module TerminusModule
 */
export declare class SequelizeHealthIndicator {
    private readonly moduleRef;
    private readonly healthIndicatorService;
    constructor(moduleRef: ModuleRef, healthIndicatorService: HealthIndicatorService);
    /**
     * Checks if the dependant packages are present
     */
    private checkDependantPackages;
    /**
     * Returns the connection of the current DI context
     */
    private getContextConnection;
    /**
     * Pings a sequelize connection
     * @param connection The connection which the ping should get executed
     * @param timeout The timeout how long the ping should maximum take
     *
     */
    private pingDb;
    /**
     * Checks if the Sequelize responds in (default) 1000ms and
     * returns a result object corresponding to the result
     *
     * @param key The key which will be used for the result object
     * @param options The options for the ping
     * @example
     * sequelizeHealthIndicator.pingCheck('database', { timeout: 1500 });
     */
    pingCheck<Key extends string = string>(key: Key, options?: SequelizePingCheckSettings): Promise<HealthIndicatorResult<Key>>;
}
