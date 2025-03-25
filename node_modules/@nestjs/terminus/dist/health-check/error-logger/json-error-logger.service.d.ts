import { type ErrorLogger } from './error-logger.interface';
export declare class JsonErrorLogger implements ErrorLogger {
    getErrorMessage(message: string, causes: any): string;
}
