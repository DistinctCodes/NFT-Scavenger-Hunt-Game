import { type HealthIndicatorResult } from '../';
import { HealthIndicatorService } from '../health-indicator.service';
/**
 * The MemoryHealthIndicator contains checks which are related
 * to the memory storage of the current running machine
 *
 * @publicApi
 * @module TerminusModule
 */
export declare class MemoryHealthIndicator {
    private readonly healthIndicatorService;
    constructor(healthIndicatorService: HealthIndicatorService);
    /**
     * Checks the heap space and returns the status
     *
     * @param key The key which will be used for the result object
     * @param options The options of the `MemoryHealthIndicator`
     *
     * @throws {StorageExceededError} In case the heap has exceeded the given threshold
     *
     *
     * @returns {Promise<HealthIndicatorResult>} The result of the health indicator check
     *
     * @example
     * // The process should not use more than 150MB memory
     * memoryHealthIndicator.checkHeap('memory_heap', 150 * 1024 * 1024);
     */
    checkHeap<Key extends string = string>(key: Key, heapUsedThreshold: number): Promise<HealthIndicatorResult<Key>>;
    /**
     * Checks the rss space and returns the status
     *
     * @param key The key which will be used for the result object
     * @param options The options of the `MemoryHealthIndicator`
     *
     * @throws {StorageExceededError} In case the rss has exceeded the given threshold
     *
     * @returns {Promise<HealthIndicatorResult>} The result of the health indicator check
     *
     *  @example
     * // The process should not have more than 150MB allocated
     * memoryHealthIndicator.checkRSS('memory_rss', 150 * 1024 * 1024);
     */
    checkRSS<Key extends string = string>(key: Key, rssThreshold: number): Promise<HealthIndicatorResult<Key>>;
}
