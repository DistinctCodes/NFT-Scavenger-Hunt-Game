import { type HealthCheckStatus } from './health-check-result.interface';
import { type HealthIndicatorResult } from '../health-indicator';
export declare function getHealthCheckSchema(status: HealthCheckStatus): {
    type: string;
    properties: {
        status: {
            type: string;
            example: HealthCheckStatus;
        };
        info: {
            nullable: boolean;
            type: string;
            example: HealthIndicatorResult;
            additionalProperties: {
                type: string;
                required: string[];
                properties: {
                    status: {
                        type: string;
                    };
                };
                additionalProperties: boolean;
            };
        };
        error: {
            nullable: boolean;
            type: string;
            example: HealthIndicatorResult;
            additionalProperties: {
                type: string;
                required: string[];
                properties: {
                    status: {
                        type: string;
                    };
                };
                additionalProperties: boolean;
            };
        };
        details: {
            type: string;
            example: HealthIndicatorResult;
            additionalProperties: {
                type: string;
                required: string[];
                properties: {
                    status: {
                        type: string;
                    };
                };
                additionalProperties: boolean;
            };
        };
    };
};
