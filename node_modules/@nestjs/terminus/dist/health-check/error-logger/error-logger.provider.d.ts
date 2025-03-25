import { type Provider } from '@nestjs/common';
import { type ErrorLogger } from './error-logger.interface';
import { type ErrorLogStyle } from '../../terminus-options.interface';
export declare const ERROR_LOGGER = "TERMINUS_ERROR_LOGGER";
export declare function getErrorLoggerProvider(errorLogStyle?: ErrorLogStyle): Provider<ErrorLogger>;
