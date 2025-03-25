"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiskUsageLibProvider = void 0;
const check_disk_space_1 = require("check-disk-space");
const terminus_constants_1 = require("../../terminus.constants");
/**
 * Wrapper of the check-disk-space library.
 *
 * @internal
 */
exports.DiskUsageLibProvider = {
    provide: terminus_constants_1.CHECK_DISK_SPACE_LIB,
    useValue: check_disk_space_1.default,
};
//# sourceMappingURL=disk-usage-lib.provider.js.map