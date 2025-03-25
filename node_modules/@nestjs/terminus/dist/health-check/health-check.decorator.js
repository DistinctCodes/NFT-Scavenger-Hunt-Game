"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheck = void 0;
const common_1 = require("@nestjs/common");
const health_check_schema_1 = require("./health-check.schema");
/**
 * Marks the endpoint as a Health Check endpoint.
 *
 * - If the `@nestjs/swagger` package is installed, the endpoint will be documented.
 * - Per default, the response will not be cached.
 *
 * @publicApi
 */
const HealthCheck = ({ noCache, swaggerDocumentation } = {
    noCache: true,
    swaggerDocumentation: true,
}) => {
    const decorators = [];
    if (swaggerDocumentation) {
        let swagger = null;
        try {
            swagger = require('@nestjs/swagger');
        }
        catch (_a) { }
        if (swagger) {
            decorators.push(...getSwaggerDefinitions(swagger));
        }
    }
    if (noCache) {
        const CacheControl = (0, common_1.Header)('Cache-Control', 'no-cache, no-store, must-revalidate');
        decorators.push(CacheControl);
    }
    return (target, key, descriptor) => {
        decorators.forEach((decorator) => {
            decorator(target, key, descriptor);
        });
    };
};
exports.HealthCheck = HealthCheck;
function getSwaggerDefinitions(swagger) {
    const { ApiOkResponse, ApiServiceUnavailableResponse } = swagger;
    const ServiceUnavailable = ApiServiceUnavailableResponse({
        description: 'The Health Check is not successful',
        schema: (0, health_check_schema_1.getHealthCheckSchema)('error'),
    });
    const Ok = ApiOkResponse({
        description: 'The Health Check is successful',
        schema: (0, health_check_schema_1.getHealthCheckSchema)('ok'),
    });
    return [ServiceUnavailable, Ok];
}
//# sourceMappingURL=health-check.decorator.js.map