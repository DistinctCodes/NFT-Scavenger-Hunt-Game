"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHealthCheckSchema = getHealthCheckSchema;
// These examples will be displayed on Swagger
const DB_EXAMPLE = { database: { status: 'up' } };
const REDIS_EXAMPLE = {
    redis: { status: 'down', message: 'Could not connect' },
};
const COMBINED_EXAMPLE = Object.assign(Object.assign({}, DB_EXAMPLE), REDIS_EXAMPLE);
const healthIndicatorSchema = (example) => ({
    type: 'object',
    example,
    additionalProperties: {
        type: 'object',
        required: ['status'],
        properties: {
            status: {
                type: 'string',
            },
        },
        additionalProperties: true,
    },
});
function getHealthCheckSchema(status) {
    return {
        type: 'object',
        properties: {
            status: {
                type: 'string',
                example: status,
            },
            info: Object.assign(Object.assign({}, healthIndicatorSchema(DB_EXAMPLE)), { nullable: true }),
            error: Object.assign(Object.assign({}, healthIndicatorSchema(status === 'error' ? REDIS_EXAMPLE : {})), { nullable: true }),
            details: healthIndicatorSchema(status === 'error' ? COMBINED_EXAMPLE : DB_EXAMPLE),
        },
    };
}
//# sourceMappingURL=health-check.schema.js.map