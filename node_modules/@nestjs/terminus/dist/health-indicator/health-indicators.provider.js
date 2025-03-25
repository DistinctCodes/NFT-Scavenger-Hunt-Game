"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HEALTH_INDICATORS = void 0;
const _1 = require(".");
const mikro_orm_health_1 = require("./database/mikro-orm.health");
/**
 * All the health indicators terminus provides as array
 */
exports.HEALTH_INDICATORS = [
    _1.TypeOrmHealthIndicator,
    _1.HttpHealthIndicator,
    _1.MongooseHealthIndicator,
    _1.SequelizeHealthIndicator,
    _1.DiskHealthIndicator,
    _1.MemoryHealthIndicator,
    _1.MicroserviceHealthIndicator,
    _1.GRPCHealthIndicator,
    mikro_orm_health_1.MikroOrmHealthIndicator,
    _1.PrismaHealthIndicator,
];
//# sourceMappingURL=health-indicators.provider.js.map