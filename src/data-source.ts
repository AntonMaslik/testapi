import { ConfigService, ConfigModule } from '@nestjs/config';

import { DataSource } from 'typeorm';

ConfigModule.forRoot({ envFilePath: `.env`, isGlobal: true });

const configService = new ConfigService();

export default new DataSource({
    type: 'postgres',
    host: configService.getOrThrow<string>('POSTGRES_HOST'),
    port: +configService.getOrThrow<number>('POSTGRES_PORT'),
    username: configService.getOrThrow<string>('POSTGRES_USER'),
    password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
    database: configService.getOrThrow<string>('POSTGRES_DATABASE'),
    entities: ['src/**/entity/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*{.ts, .js}'],
    migrationsTableName: 'migration_table',
    synchronize: false,
});
