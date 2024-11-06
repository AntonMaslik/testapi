import { DataSource } from 'typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';

ConfigModule.forRoot({ envFilePath: `.env`, isGlobal: true });

const configService = new ConfigService();

console.log(process.env);

export default new DataSource({
    type: 'postgres',
    host: configService.getOrThrow<string>('POSTGRES_HOST'),
    port: +configService.getOrThrow<number>('POSTGRES_PORT'),
    username: configService.getOrThrow<string>('POSTGRES_USER'),
    password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
    database: configService.getOrThrow<string>('POSTGRES_DATABASE'),
    entities: ['/src/**/entity/*.entity{.ts,.js}'],
    migrations: ['src/migrations/*.migrate{.ts, .js}'],
    migrationsTableName: 'migration_table',
    synchronize: false,
});