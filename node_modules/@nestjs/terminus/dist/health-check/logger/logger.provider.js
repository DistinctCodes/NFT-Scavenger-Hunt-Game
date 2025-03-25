"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TERMINUS_LOGGER = void 0;
exports.getLoggerProvider = getLoggerProvider;
const common_1 = require("@nestjs/common");
exports.TERMINUS_LOGGER = 'TERMINUS_LOGGER';
const NOOP_LOGGER = {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    log: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    error: () => { },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    warn: () => { },
};
function getLoggerProvider(logger) {
    // Enable logging
    if (logger === true || logger === undefined) {
        return {
            provide: exports.TERMINUS_LOGGER,
            useClass: common_1.Logger,
        };
    }
    // Disable logging
    if (logger === false) {
        return {
            provide: exports.TERMINUS_LOGGER,
            useValue: NOOP_LOGGER,
        };
    }
    // Custom logger
    return {
        provide: exports.TERMINUS_LOGGER,
        useClass: logger,
    };
}
//# sourceMappingURL=logger.provider.js.map