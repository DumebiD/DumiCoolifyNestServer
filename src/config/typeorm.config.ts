import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config'

export const typeormConfig = (config: ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: config.get<string>('POSTGRES_HOST'),
    port: config.get<number>('POSTGRES_PORT'),
    username: config.getOrThrow<string>('POSTGRES_USER'),
    password: config.getOrThrow<string>('POSTGRES_PASSWORD'),
    database: config.getOrThrow<string>('POSTGRES_DB'),
    synchronize: config.get<string>('TYPEORM_SYNCHRONISE') === 'true',
    migrationsRun: !(config.get<string>('TYPEORM_SYNCHRONISE') === 'true'),
    // migrations: [__dirname + '/../migrations/*{.ts,.js}'],
    migrations: ['dist/migrations/*.js'],
    autoLoadEntities: true
})