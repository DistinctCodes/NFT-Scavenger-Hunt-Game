"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthCheckError = exports.HealthCheckService = exports.HealthCheck = exports.TerminusModule = void 0;
var terminus_module_1 = require("./terminus.module");
Object.defineProperty(exports, "TerminusModule", { enumerable: true, get: function () { return terminus_module_1.TerminusModule; } });
__exportStar(require("./health-indicator"), exports);
__exportStar(require("./errors"), exports);
var health_check_1 = require("./health-check");
Object.defineProperty(exports, "HealthCheck", { enumerable: true, get: function () { return health_check_1.HealthCheck; } });
Object.defineProperty(exports, "HealthCheckService", { enumerable: true, get: function () { return health_check_1.HealthCheckService; } });
// eslint-disable-next-line deprecation/deprecation
Object.defineProperty(exports, "HealthCheckError", { enumerable: true, get: function () { return health_check_1.HealthCheckError; } });
//# sourceMappingURL=index.js.map