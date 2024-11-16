import { Module } from '@nestjs/common';

import { AppController } from './app.controller';

import { AppService } from './app.service';

import { TypeOrmModule } from '@nestjs/typeorm';

import { WorkspaceModule } from './workspaces/workspaces.module';
import { UserModule } from './users/users.module';
import { TaskModule } from './tasks/tasks.module';
import { AuthModule } from './auth/auth.module';

import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: `.env`, isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: databaseConfig,
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
