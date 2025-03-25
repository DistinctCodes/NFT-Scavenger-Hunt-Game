"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ERROR_LOGGERS = void 0;
const json_error_logger_service_1 = require("./json-error-logger.service");
const pretty_error_logger_service_1 = require("./pretty-error-logger.service");
exports.ERROR_LOGGERS = [
    json_error_logger_service_1.JsonErrorLogger,
    pretty_error_logger_service_1.PrettyErrorLogger,
];
//# sourceMappingURL=error-loggers.provider.js.map