"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkPackages = checkPackages;
const logger_service_1 = require("@nestjs/common/services/logger.service");
/**
 * Generates the string which packages are missing and
 * how to install them
 *
 * @param name The name of the packages
 * @param reason The reason why these packages are important
 *
 * @internal
 */
const MISSING_REQUIRED_DEPENDENCY = (names, reason) => `The "${names.join('", "')}" package${names.length > 1 ? 's are' : ' is'} missing. Please, make sure to install the librar${names.length > 1 ? 'ies' : 'y'} ($ npm install ${names.join(' ')}) to take advantage of ${reason}.`;
/**
 * @internal
 */
const logger = new logger_service_1.Logger('PackageLoader');
/**
 * Loads an optional module
 *
 * @param module The module name
 * @internal
 *
 * @returns {T | null} The module or null if has not found
 */
function optional(module) {
    try {
        if (module[0] in { '.': 1 }) {
            module = process.cwd() + module.substring(1);
        }
        return require(`${module}`);
    }
    catch (err) { }
    return null;
}
/**
 * Checks if the given packages are available and logs using the Nest Logger
 * which packages are not available
 * @param packageNames The package names
 * @param reason The reason why these packages are important
 *
 * @internal
 *
 * @example
 * //  The "no_package" package is missing. Please, make sure to install the library ($ npm install no_package) to take advantage of TEST.
 * checkPackages(['process', 'no_package'], 'TEST')
 */
function checkPackages(packageNames, reason) {
    const packages = packageNames.map((packageName, index) => ({
        pkg: optional(packageName),
        index,
    }));
    const missingDependenciesNames = packages
        .filter((pkg) => pkg.pkg === null)
        .map((pkg) => packageNames[pkg.index]);
    if (missingDependenciesNames.length) {
        logger.error(MISSING_REQUIRED_DEPENDENCY(missingDependenciesNames, reason));
        logger_service_1.Logger.flush();
        process.exit(1);
    }
    return packages.map((pkg) => pkg.pkg);
}
//# sourceMappingURL=checkPackage.util.js.map