/**
 * An errors which gets raised when the timeout
 * exceeded
 *
 * @internal
 */
export declare class TimeoutError extends Error {
}
/**
 * Executes a promise in the given timeout. If the promise
 * does not finish in the given timeout, it will
 * raise a TimeoutError
 *
 * @param {number} ms The timeout in milliseconds
 * @param {Promise<any>} promise The promise which should get executed
 *
 * @internal
 */
export declare const promiseTimeout: <T>(ms: number, promise: Promise<T>) => Promise<T>;
