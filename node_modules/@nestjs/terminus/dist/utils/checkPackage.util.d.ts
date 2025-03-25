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
export declare function checkPackages(packageNames: string[], reason: string): any[];
