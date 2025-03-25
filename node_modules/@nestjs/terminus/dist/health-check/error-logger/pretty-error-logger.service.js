"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrettyErrorLogger = void 0;
const common_1 = require("@nestjs/common");
const boxen = require("boxen");
const GREEN = '\x1b[0m\x1b[32m';
const RED = '\x1b[0m\x1b[31m';
const STOP_COLOR = '\x1b[0m';
let PrettyErrorLogger = class PrettyErrorLogger {
    printIndent(level) {
        if (level === 0) {
            return '';
        }
        return `${' '.repeat(level * 2)}- `;
    }
    printIndicatorSummary(result, level = 0) {
        const messages = [];
        for (const [key, value] of Object.entries(result)) {
            if (typeof value === 'object' && value !== null) {
                messages.push(`${this.printIndent(level)}${key}:\n${this.printIndicatorSummary(value, level + 1)}`);
            }
            else {
                const val = (value === null || value === void 0 ? void 0 : value.toString)
                    ? value.toString()
                    : value;
                messages.push(`${this.printIndent(level)}${key}: ${val}`);
            }
        }
        return messages.join('\n');
    }
    printSummary(result) {
        let message = '';
        for (const [key, value] of Object.entries(result)) {
            const summary = this.printIndicatorSummary(value);
            if (value.status === 'up') {
                message +=
                    GREEN +
                        boxen(summary, {
                            padding: 1,
                            title: `✅ ${key}`,
                        }) +
                        STOP_COLOR +
                        '\n';
            }
            if (value.status === 'down') {
                message +=
                    RED +
                        boxen(summary, {
                            padding: 1,
                            title: `❌ ${key}`,
                        }) +
                        STOP_COLOR +
                        '\n';
            }
        }
        return message;
    }
    getErrorMessage(message, causes) {
        return `${message}\n\n${this.printSummary(causes)}`;
    }
};
exports.PrettyErrorLogger = PrettyErrorLogger;
exports.PrettyErrorLogger = PrettyErrorLogger = __decorate([
    (0, common_1.Injectable)()
], PrettyErrorLogger);
//# sourceMappingURL=pretty-error-logger.service.js.map