import type checkDiskSpace from 'check-disk-space';
import { type DiskHealthIndicatorOptions } from './disk-health-options.type';
import { type HealthIndicatorResult } from '../';
import { HealthIndicatorService } from '../health-indicator.service';
type CheckDiskSpace = typeof checkDiskSpace;
/**
 * The DiskHealthIndicator contains checks which are related
 * to the disk storage of the current running machine
 *
 * @publicApi
 * @module TerminusModule
 */
export declare class DiskHealthIndicator {
    private readonly checkDiskSpace;
    private readonly healthIndicatorService;
    constructor(checkDiskSpace: CheckDiskSpace, healthIndicatorService: HealthIndicatorService);
    /**
     * Checks if the given option has the property the `thresholdPercent` attribute
     *
     * @param {DiskHealthIndicatorOptions} options The options of the `DiskHealthIndicator`
     *
     * @private
     *
     * @returns {boolean} whether given option has the property the `thresholdPercent` attribute
     */
    private isOptionThresholdPercent;
    /**
     * Checks if the size of the given size has exceeded the
     * given threshold
     *
     * @param key The key which will be used for the result object
     *
     * @throws {HealthCheckError} In case the health indicator failed
     * @throws {StorageExceededError} In case the disk storage has exceeded the given threshold
     *
     * @returns {Promise<HealthIndicatorResult>} The result of the health indicator check
     *
     * @example
     * // The used disk storage should not exceed 250 GB
     * diskHealthIndicator.checkStorage('storage', { threshold: 250 * 1024 * 1024 * 1024, path: '/' });
     * @example
     * // The used disk storage should not exceed 50% of the full disk size
     * diskHealthIndicator.checkStorage('storage', { thresholdPercent: 0.5, path: 'C:\\' });
     */
    checkStorage<Key extends string = string>(key: Key, options: DiskHealthIndicatorOptions): Promise<HealthIndicatorResult<Key>>;
}
export {};
