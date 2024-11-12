import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export default (configService: ConfigService): TypeOrmModuleOptions => {
    const options: TypeOrmModuleOptions = {
        type: 'postgres',
        host: configService.getOrThrow<string>('POSTGRES_HOST'),
        port: +configService.getOrThrow<number>('POSTGRES_PORT'),
        username: configService.getOrThrow<string>('POSTGRES_USER'),
        password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
        database: configService.getOrThrow<string>('POSTGRES_DATABASE'),
        entities: ['entity/*.entity{.ts,.js}'],
        synchronize: false,
        autoLoadEntities: true,
    };
    return options;
};
