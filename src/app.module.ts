import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './users/users.module';
import { TaskModule } from './tasks/tasks.module';
import { WorkspaceModule } from './workspaces/workspaces.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: `.env`, isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                type: 'postgres',
                host: configService.getOrThrow<string>('POSTGRES_HOST'),
                port: +configService.getOrThrow<number>('POSTGRES_PORT'),
                username: configService.getOrThrow<string>('POSTGRES_USER'),
                password: configService.getOrThrow<string>('POSTGRES_PASSWORD'),
                database: configService.getOrThrow<string>('POSTGRES_DATABASE'),
                entities: ['entity/*.entity{.ts,.js}'],
                synchronize: false,
                autoLoadEntities: true,
            }),
            inject: [ConfigService],
        }),
        UserModule,
        TaskModule,
        WorkspaceModule,
        AuthModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
