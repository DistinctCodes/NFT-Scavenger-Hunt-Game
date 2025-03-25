"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_LOGGER = void 0;
exports.getErrorLoggerProvider = getErrorLoggerProvider;
const json_error_logger_service_1 = require("./json-error-logger.service");
const pretty_error_logger_service_1 = require("./pretty-error-logger.service");
exports.ERROR_LOGGER = 'TERMINUS_ERROR_LOGGER';
function getErrorLoggerProvider(errorLogStyle) {
    switch (errorLogStyle) {
        case 'pretty':
            return {
                provide: exports.ERROR_LOGGER,
                useClass: pretty_error_logger_service_1.PrettyErrorLogger,
            };
        default:
            return {
                provide: exports.ERROR_LOGGER,
                useClass: json_error_logger_service_1.JsonErrorLogger,
            };
    }
}
//# sourceMappingURL=error-logger.provider.js.map