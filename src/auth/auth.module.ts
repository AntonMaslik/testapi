import { Module } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { AuthController } from './auth/auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserEntity } from 'src/users/entity/user.entity';
import { RefreshTokenStrategy } from './auth/refreshToken.strategy';
import { AccessTokenStrategy } from './auth/jwt.strategy';
import { UserService } from 'src/users/user/user.service';
import { ConfigService } from '@nestjs/config';
import { RolesEntity } from './roles/roles.entity';
import { RolesService } from './roles/roles.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, RolesEntity]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({}),
    ],
    providers: [
        AuthService,
        RolesService,
        AccessTokenStrategy,
        RefreshTokenStrategy,
        UserService,
        ConfigService,
    ],
    controllers: [AuthController],
    exports: [AccessTokenStrategy, PassportModule],
})
export class AuthModule {}
