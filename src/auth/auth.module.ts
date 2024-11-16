import { Module } from '@nestjs/common';

import { AuthService } from './auth/auth.service';
import { RolesService } from './roles/roles/roles.service';
import { UserService } from 'src/users/users/users.service';

import { AuthController } from './auth/auth.controller';
import { RolesController } from './roles/roles/roles.controller';

import { TypeOrmModule } from '@nestjs/typeorm';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AccessTokenStrategy } from './strategy/jwt.strategy';
import { RefreshTokenStrategy } from './strategy/refreshToken.strategy';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserEntity } from 'src/users/entity/user.entity';
import { RolesEntity } from './roles/entity/roles.entity';
import { TaskEntity } from 'src/tasks/entity/tasks.entity';
import { WorkspaceEntity } from 'src/workspaces/entity/workspace.entity';
import { TokenEntity } from './tokens/entity/tokens.entity';

import jwtConfig from 'src/config/jwt.config';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            RolesEntity,
            WorkspaceEntity,
            TaskEntity,
            TokenEntity,
        ]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({}),
        ConfigModule.forRoot({
            load: [jwtConfig],
        }),
    ],
    providers: [
        AuthService,
        RolesService,
        UserService,
        ConfigService,
        AccessTokenStrategy,
        RefreshTokenStrategy,
    ],
    controllers: [AuthController, RolesController],
    exports: [AccessTokenStrategy, PassportModule],
})
export class AuthModule {}
