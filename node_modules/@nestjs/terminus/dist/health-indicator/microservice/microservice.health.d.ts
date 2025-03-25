import { type HealthIndicatorResult } from '../';
import { type PropType } from '../../utils';
import { HealthIndicatorService } from '../health-indicator.service';
interface MicroserviceOptionsLike {
    transport?: number;
    options?: object;
}
/**
 * The options for the `MicroserviceHealthIndicator`
 */
export type MicroserviceHealthIndicatorOptions<T extends MicroserviceOptionsLike = MicroserviceOptionsLike> = {
    transport: Required<PropType<MicroserviceOptionsLike, 'transport'>>;
    timeout?: number;
} & Partial<T>;
/**
 * The MicroserviceHealthIndicator is a health indicators
 * which is used for health checks related to microservices
 *
 * @publicApi
 * @module TerminusModule
 */
export declare class MicroserviceHealthIndicator {
    private readonly healthIndicatorService;
    private nestJsMicroservices;
    constructor(healthIndicatorService: HealthIndicatorService);
    /**
     * Checks if the dependant packages are present
     */
    private checkDependantPackages;
    private pingMicroservice;
    /**
     * Checks if the given microservice is up
     * @param key The key which will be used for the result object
     * @param options The options of the microservice
     *
     * @throws {HealthCheckError} If the microservice is not reachable
     *
     * @example
     * microservice.pingCheck<TcpClientOptions>('tcp', {
     *   transport: Transport.TCP,
     *   options: { host: 'localhost', port: 3001 },
     * })
     */
    pingCheck<MicroserviceClientOptions extends MicroserviceOptionsLike, Key extends string = string>(key: Key, options: MicroserviceHealthIndicatorOptions<MicroserviceClientOptions>): Promise<HealthIndicatorResult<Key>>;
}
export {};
