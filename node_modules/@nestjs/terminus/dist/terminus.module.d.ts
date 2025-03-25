import { type DynamicModule } from '@nestjs/common';
import { type TerminusModuleOptions } from './terminus-options.interface';
/**
 * The Terminus module integrates health checks
 * and graceful shutdowns in your Nest application
 *
 * @publicApi
 */
export declare class TerminusModule {
    static forRoot(options?: TerminusModuleOptions): DynamicModule;
}
