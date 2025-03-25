/**
 * @publicApi
 */
export interface HealthCheckOptions {
    /**
     * Whether to cache the response or not.
     * - If set to `true`, the response header will be set to `Cache-Control: no-cache, no-store, must-revalidate`.
     * - If set to `false`, no header will be set and can be set manually with e.g. `@Header('Cache-Control', 'max-age=604800')`.
     *
     * @default true
     */
    noCache?: boolean;
    /**
     * Whether to document the endpoint with Swagger or not.
     *
     * @default true
     */
    swaggerDocumentation?: boolean;
}
/**
 * Marks the endpoint as a Health Check endpoint.
 *
 * - If the `@nestjs/swagger` package is installed, the endpoint will be documented.
 * - Per default, the response will not be cached.
 *
 * @publicApi
 */
export declare const HealthCheck: ({ noCache, swaggerDocumentation }?: HealthCheckOptions) => (target: any, key: any, descriptor: PropertyDescriptor) => void;
