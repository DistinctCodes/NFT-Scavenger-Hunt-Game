import { TypeOrmHealthIndicator, HttpHealthIndicator, MongooseHealthIndicator, SequelizeHealthIndicator, DiskHealthIndicator, MemoryHealthIndicator, MicroserviceHealthIndicator, GRPCHealthIndicator, PrismaHealthIndicator } from '.';
import { MikroOrmHealthIndicator } from './database/mikro-orm.health';
/**
 * All the health indicators terminus provides as array
 */
export declare const HEALTH_INDICATORS: (typeof HttpHealthIndicator | typeof MongooseHealthIndicator | typeof TypeOrmHealthIndicator | typeof MikroOrmHealthIndicator | typeof SequelizeHealthIndicator | typeof PrismaHealthIndicator | typeof MicroserviceHealthIndicator | typeof GRPCHealthIndicator | typeof DiskHealthIndicator | typeof MemoryHealthIndicator)[];
