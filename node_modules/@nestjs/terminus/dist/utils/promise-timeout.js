"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promiseTimeout = exports.TimeoutError = void 0;
/**
 * An errors which gets raised when the timeout
 * exceeded
 *
 * @internal
 */
class TimeoutError extends Error {
}
exports.TimeoutError = TimeoutError;
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
const promiseTimeout = (ms, promise) => {
    let timer;
    return Promise.race([
        promise,
        new Promise((_, reject) => (timer = setTimeout(() => reject(new TimeoutError(`Timed out in ${ms}ms.`)), ms))),
    ]).finally(() => clearTimeout(timer));
};
exports.promiseTimeout = promiseTimeout;
//# sourceMappingURL=promise-timeout.js.map