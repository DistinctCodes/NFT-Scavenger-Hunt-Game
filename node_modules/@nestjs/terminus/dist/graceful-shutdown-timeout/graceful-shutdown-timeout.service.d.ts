import { type BeforeApplicationShutdown, LoggerService } from '@nestjs/common';
export declare const TERMINUS_GRACEFUL_SHUTDOWN_TIMEOUT = "TERMINUS_GRACEFUL_SHUTDOWN_TIMEOUT";
/**
 * Handles Graceful shutdown timeout useful to await
 * for some time before the application shuts down.
 */
export declare class GracefulShutdownService implements BeforeApplicationShutdown {
    private readonly logger;
    private readonly gracefulShutdownTimeoutMs;
    constructor(logger: LoggerService, gracefulShutdownTimeoutMs: number);
    beforeApplicationShutdown(signal: string): Promise<void>;
}
