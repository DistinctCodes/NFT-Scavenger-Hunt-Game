import { type HealthCheckError } from '../';
import { type AxiosError } from '../errors/axios.error';
export declare function isHealthCheckError(err: any): err is HealthCheckError;
export declare function isAxiosError(err: any): err is AxiosError;
export declare function isError(err: any): err is Error;
