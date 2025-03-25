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
var GracefulShutdownService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GracefulShutdownService = exports.TERMINUS_GRACEFUL_SHUTDOWN_TIMEOUT = void 0;
const common_1 = require("@nestjs/common");
const logger_provider_1 = require("../health-check/logger/logger.provider");
const utils_1 = require("../utils");
exports.TERMINUS_GRACEFUL_SHUTDOWN_TIMEOUT = 'TERMINUS_GRACEFUL_SHUTDOWN_TIMEOUT';
/**
 * Handles Graceful shutdown timeout useful to await
 * for some time before the application shuts down.
 */
let GracefulShutdownService = GracefulShutdownService_1 = class GracefulShutdownService {
    constructor(logger, gracefulShutdownTimeoutMs) {
        this.logger = logger;
        this.gracefulShutdownTimeoutMs = gracefulShutdownTimeoutMs;
        if (this.logger instanceof common_1.ConsoleLogger) {
            this.logger.setContext(GracefulShutdownService_1.name);
        }
    }
    beforeApplicationShutdown(signal) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log(`Received termination signal ${signal || ''}`);
            if (signal === 'SIGTERM') {
                this.logger.log(`Awaiting ${this.gracefulShutdownTimeoutMs}ms before shutdown`);
                yield (0, utils_1.sleep)(this.gracefulShutdownTimeoutMs);
                this.logger.log(`Timeout reached, shutting down now`);
            }
        });
    }
};
exports.GracefulShutdownService = GracefulShutdownService;
exports.GracefulShutdownService = GracefulShutdownService = GracefulShutdownService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(logger_provider_1.TERMINUS_LOGGER)),
    __param(1, (0, common_1.Inject)(exports.TERMINUS_GRACEFUL_SHUTDOWN_TIMEOUT)),
    __metadata("design:paramtypes", [Object, Number])
], GracefulShutdownService);
//# sourceMappingURL=graceful-shutdown-timeout.service.js.map