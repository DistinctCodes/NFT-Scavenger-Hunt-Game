import { type ErrorLogger } from './error-logger.interface';
import { type HealthIndicatorResult } from '../../health-indicator';
export declare class PrettyErrorLogger implements ErrorLogger {
    private printIndent;
    private printIndicatorSummary;
    private printSummary;
    getErrorMessage(message: string, causes: HealthIndicatorResult): string;
}
