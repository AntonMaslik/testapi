import {
    BadRequestException,
    Injectable,
    ForbiddenException,
    NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';

import { UserEntity } from '../../users/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dto/sign-up-dto';
import { UserService } from 'src/users/users/users.service';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from '../dto/sign-in-dto';
import { Role } from '../roles/roles/roles.enum';

import { RolesEntity } from '../roles/entity/roles.entity';
import { TokenEntity } from '../tokens/entity/tokens.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,

        @InjectRepository(TokenEntity)
        private tokensRepository: Repository<TokenEntity>,

        @InjectRepository(RolesEntity)
        private rolesRepository: Repository<RolesEntity>,

        private jwtService: JwtService,
        private usersService: UserService,
        private configService: ConfigService,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<{ accessToken; refreshToken }> {
        const userExists = await this.usersRepository.findOne({
            where: {
                email: signUpDto.email,
            },
        });

        if (userExists) {
            throw new BadRequestException('User already exists');
        }

        const defaultRole = await this.rolesRepository.find({
            where: { name: Role.USER },
        });

        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

        const newUser = await this.usersService.createUser({
            email: signUpDto.email,
            name: signUpDto.name,
            password: hashedPassword,
            roles: defaultRole,
        });
        const tokens = await this.getTokens(newUser.id, newUser.name);

        await this.updateRefreshToken(newUser.id, tokens.refreshToken);

        return tokens;
    }

    async signIn(signInDto: SignInDto): Promise<{ accessToken; refreshToken }> {
        const user = await this.usersRepository.findOne({
            where: {
                email: signInDto.email,
            },
        });

        if (!user) {
            throw new BadRequestException('User does not exist');
        }

        const passwordMatches = await bcrypt.compare(
            signInDto.password,
            user.password,
        );

        if (!passwordMatches) {
            throw new BadRequestException('Password is incorrect');
        }

        const { accessToken, refreshToken } = await this.getTokens(
            user.id,
            user.name,
        );

        await this.updateRefreshToken(user.id, refreshToken);

        return { accessToken, refreshToken };
    }

    async logout(userId: number, refreshToken: string): Promise<Boolean> {
        const token = await this.tokensRepository.findOne({
            where: {
                refreshToken: refreshToken,
                userId,
            },
        });

        return true;
    }

    async invalidateAllTokensWithException(
        userId: number,
        refreshToken: string,
    ): Promise<Boolean> {
        const tokens = await this.tokensRepository.find({
            where: {
                userId: userId,
                refreshToken: Not(refreshToken),
            },
        });

        if (!tokens.length) {
            throw new NotFoundException('Tokens not find!');
        }

        return true;
    }

    async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
        await this.tokensRepository.save({
            refreshToken: refreshToken,
            userId: id,
        });
    }

    async refreshTokens(
        user: UserEntity,
        refreshToken: string,
    ): Promise<{ accessToken; refreshToken }> {
        if (!refreshToken) {
            throw new ForbiddenException('Access Denied');
        }

        const tokenInfo = await this.tokensRepository.findOne({
            where: { refreshToken: refreshToken },
        });

        const hash = await bcrypt.hash(refreshToken, 10);
        const refreshTokenMatches = await bcrypt.compare(
            tokenInfo.refreshToken,
            hash,
        );

        if (!refreshTokenMatches || !tokenInfo) {
            throw new ForbiddenException('Access Denied');
        }

        const tokens = await this.getTokens(user.id, user.name);

        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async getTokens(
        userId: number,
        username: string,
    ): Promise<{ accessToken; refreshToken }> {
        const jwtConfig = this.configService.get('jwt');

        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: jwtConfig.accessSecret,
                    expiresIn: jwtConfig.accessTokenExpiration,
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: jwtConfig.refreshSecret,
                    expiresIn: jwtConfig.refreshTokenExpiration,
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}
