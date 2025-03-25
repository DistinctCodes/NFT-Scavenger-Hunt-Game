"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var HttpHealthIndicator_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpHealthIndicator = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rxjs_1 = require("rxjs");
const logger_provider_1 = require("../../health-check/logger/logger.provider");
const utils_1 = require("../../utils");
const health_indicator_service_1 = require("../health-indicator.service");
/**
 * The HTTPHealthIndicator contains health indicators
 * which are used for health checks related to HTTP requests
 *
 * @publicApi
 * @module TerminusModule
 */
let HttpHealthIndicator = HttpHealthIndicator_1 = class HttpHealthIndicator {
    constructor(moduleRef, logger, healthIndicatorService) {
        this.moduleRef = moduleRef;
        this.logger = logger;
        this.healthIndicatorService = healthIndicatorService;
        if (this.logger instanceof common_1.ConsoleLogger) {
            this.logger.setContext(HttpHealthIndicator_1.name);
        }
        this.checkDependantPackages();
    }
    /**
     * Checks if the dependant packages are present
     */
    checkDependantPackages() {
        this.nestJsAxios = (0, utils_1.checkPackages)(['@nestjs/axios'], this.constructor.name)[0];
    }
    getHttpService() {
        try {
            return this.moduleRef.get(this.nestJsAxios.HttpService, {
                strict: false,
            });
        }
        catch (err) {
            this.logger.error('It seems like "HttpService" is not available in the current context. Are you sure you imported the HttpModule from the @nestjs/axios package?');
            throw new Error('It seems like "HttpService" is not available in the current context. Are you sure you imported the HttpModule from the @nestjs/axios package?');
        }
    }
    /**
     * Prepares and throw a HealthCheckError
     * @param key The key which will be used for the result object
     * @param error The thrown error
     *
     * @throws {HealthCheckError}
     */
    generateHttpError(check, error) {
        const response = {
            message: error.message,
        };
        if (error.response) {
            response.statusCode = error.response.status;
            response.statusText = error.response.statusText;
        }
        return check.down(response);
    }
    /**
     * Checks if the given url response in the given timeout
     * and returns a result object corresponding to the result
     * @param key The key which will be used for the result object
     * @param url The url which should be request
     * @param options Optional axios options
     *
     * @throws {HealthCheckError} In case the health indicator failed
     *
     * @example
     * httpHealthIndicator.pingCheck('google', 'https://google.com', { timeout: 800 })
     */
    pingCheck(key_1, url_1) {
        return __awaiter(this, arguments, void 0, function* (key, url, _a = {}) {
            var { httpClient } = _a, options = __rest(_a, ["httpClient"]);
            const check = this.healthIndicatorService.check(key);
            // In case the user has a preconfigured HttpService (see `HttpModule.register`)
            // we just let him/her pass in this HttpService so that he/she does not need to
            // reconfigure it.
            // https://github.com/nestjs/terminus/issues/1151
            const httpService = httpClient || this.getHttpService();
            try {
                yield (0, rxjs_1.lastValueFrom)(httpService.request(Object.assign({ url }, options)));
            }
            catch (err) {
                if ((0, utils_1.isAxiosError)(err)) {
                    return this.generateHttpError(check, err);
                }
                throw err;
            }
            return check.up();
        });
    }
    responseCheck(key_1, url_1, callback_1) {
        return __awaiter(this, arguments, void 0, function* (key, url, callback, _a = {}) {
            var { httpClient } = _a, options = __rest(_a, ["httpClient"]);
            const check = this.healthIndicatorService.check(key);
            const httpService = httpClient || this.getHttpService();
            let response;
            let axiosError = null;
            try {
                response = yield (0, rxjs_1.lastValueFrom)(httpService.request(Object.assign({ url: url.toString() }, options)));
            }
            catch (error) {
                if (!(0, utils_1.isAxiosError)(error)) {
                    throw error;
                }
                // We received an Axios Error but no response for unknown reasons.
                if (!error.response) {
                    return check.down(error.message);
                }
                // We store the response no matter if the http request was successful or not.
                // So that we can pass it to the callback function and the user can decide
                // if the response is healthy or not.
                response = error.response;
                axiosError = error;
            }
            const isHealthy = yield callback(response);
            if (!isHealthy) {
                if (axiosError) {
                    return this.generateHttpError(check, axiosError);
                }
                return check.down();
            }
            return check.up();
        });
    }
};
exports.HttpHealthIndicator = HttpHealthIndicator;
exports.HttpHealthIndicator = HttpHealthIndicator = HttpHealthIndicator_1 = __decorate([
    (0, common_1.Injectable)({
        scope: common_1.Scope.TRANSIENT,
    }),
    __param(1, (0, common_1.Inject)(logger_provider_1.TERMINUS_LOGGER)),
    __metadata("design:paramtypes", [core_1.ModuleRef,
        common_1.ConsoleLogger,
        health_indicator_service_1.HealthIndicatorService])
], HttpHealthIndicator);
//# sourceMappingURL=http.health.js.map