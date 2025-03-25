import { type HealthIndicatorResult } from './health-indicator-result.interface';
/**
 * Helper service which can be used to create health indicator results
 * @publicApi
 */
export declare class HealthIndicatorService {
    check<const Key extends string>(key: Key): HealthIndicatorSession<Key>;
}
type AdditionalData = Record<string, unknown>;
/**
 * Indicate the health of a health indicator with the given key
 *
 * @publicApi
 */
export declare class HealthIndicatorSession<Key extends Readonly<string> = string> {
    private readonly key;
    constructor(key: Key);
    /**
     * Mark the health indicator as `down`
     * @param data additional data which will get appended to the result object
     */
    down<T extends AdditionalData>(data?: T): HealthIndicatorResult<typeof this.key, 'down', T>;
    down<T extends string>(data?: T): HealthIndicatorResult<typeof this.key, 'down', {
        message: T;
    }>;
    /**
     * Mark the health indicator as `up`
     * @param data additional data which will get appended to the result object
     */
    up<T extends AdditionalData>(data?: T): HealthIndicatorResult<Key, 'up', T>;
    up<T extends string>(data?: T): HealthIndicatorResult<Key, 'up', {
        message: T;
    }>;
}
export {};
