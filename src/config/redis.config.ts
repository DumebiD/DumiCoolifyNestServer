import { ConfigService } from '@nestjs/config'
import { CacheOptions } from '@nestjs/cache-manager';
import KeyvRedis from '@keyv/redis';
import { Keyv } from 'keyv';

export const redisConfig = (config: ConfigService): CacheOptions => ({
    stores: [
        new Keyv({
            store: new KeyvRedis({
                url: `redis://${config.get<string>('REDIS_HOST', 'localhost')}:${config.get<number>('REDIS_PORT', 6379)}`,
                password: config.get<string>('REDIS_PASSWORD'),
            }),
        }),
    ],
    ttl: 60000, // Default TTL in milliseconds
})