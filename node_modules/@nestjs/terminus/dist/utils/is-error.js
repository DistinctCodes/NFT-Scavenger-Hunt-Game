"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isHealthCheckError = isHealthCheckError;
exports.isAxiosError = isAxiosError;
exports.isError = isError;
// eslint-disable-next-line deprecation/deprecation
function isHealthCheckError(err) {
    return err === null || err === void 0 ? void 0 : err.isHealthCheckError;
}
function isAxiosError(err) {
    return err === null || err === void 0 ? void 0 : err.isAxiosError;
}
function isError(err) {
    return !!(err === null || err === void 0 ? void 0 : err.message);
}
//# sourceMappingURL=is-error.js.map