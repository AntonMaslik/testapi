import {
    BadRequestException,
    Injectable,
    ForbiddenException,
    OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { UserEntity } from '../../users/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dto/sign-up-dto';
import { UserService } from 'src/users/users/users.service';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from '../dto/sign-in-dto';
import { Role } from '../roles/roles/roles.enum';
import { RolesEntity } from '../roles/entity/roles.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,

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
            refreshToken: null,
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

        const tokens = await this.getTokens(user.id, user.name);

        await this.updateRefreshToken(user.id, tokens.refreshToken);

        return tokens;
    }

    async logout(userId: number): Promise<UpdateResult> {
        return this.usersRepository.update(userId, { refreshToken: null });
    }

    async updateRefreshToken(id: number, refreshToken: string): Promise<void> {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

        await this.usersRepository.update(id, {
            refreshToken: hashedRefreshToken,
        });
    }

    async refreshTokens(
        userId: number,
        refreshToken: string,
    ): Promise<{ accessToken; refreshToken }> {
        const user = await this.usersRepository.findOne({
            where: {
                id: userId,
            },
        });

        if (!user || !user.refreshToken) {
            throw new ForbiddenException('Access Denied');
        }

        const hash = await bcrypt.hash(refreshToken, 10);
        const refreshTokenMatches = await bcrypt.compare(
            user.refreshToken,
            hash,
        );

        if (!refreshTokenMatches) {
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
