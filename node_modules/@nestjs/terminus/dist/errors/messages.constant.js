"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DATABASE_NOT_CONNECTED = exports.UNHEALTHY_RESPONSE_CODE = exports.STORAGE_EXCEEDED = exports.TIMEOUT_EXCEEDED = exports.CONNECTION_NOT_FOUND = void 0;
/**
 * @internal
 */
exports.CONNECTION_NOT_FOUND = 'Connection provider not found in application context';
/**
 * @internal
 */
const TIMEOUT_EXCEEDED = (timeout) => `Timeout of ${timeout.toString()}ms exceeded`;
exports.TIMEOUT_EXCEEDED = TIMEOUT_EXCEEDED;
/**
 * @internal
 */
const STORAGE_EXCEEDED = (keyword) => `Used ${keyword} exceeded the set threshold`;
exports.STORAGE_EXCEEDED = STORAGE_EXCEEDED;
/**
 * @internal
 */
const UNHEALTHY_RESPONSE_CODE = (responseCode) => `The service returned an unhealthy response code: ${responseCode}`;
exports.UNHEALTHY_RESPONSE_CODE = UNHEALTHY_RESPONSE_CODE;
/**
 * @internal
 */
exports.DATABASE_NOT_CONNECTED = `Not connected to database`;
//# sourceMappingURL=messages.constant.js.map