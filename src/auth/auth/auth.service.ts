import {
    BadRequestException,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entity/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto } from '../dto/sign-up-dto';
import { UserService } from 'src/users/user/user.service';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from '../dto/sign-in-dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        private jwtService: JwtService,
        private usersService: UserService,
        private configService: ConfigService,
    ) {}

    async signUp(signUpDto: SignUpDto): Promise<{ accessToken; refreshToken }> {
        const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

        const userExists = await this.usersService.getUserByEmail(
            signUpDto.email,
        );
        if (userExists) {
            throw new BadRequestException('User already exists');
        }

        const newUser = await this.usersService.create({
            email: signUpDto.email,
            name: signUpDto.name,
            password: hashedPassword,
            refreshToken: null,
        });

        const tokens = await this.getTokens(newUser.id, newUser.name);
        await this.updateRefreshToken(newUser.id, tokens.refreshToken);
        return tokens;
    }

    async signIn(data: SignInDto) {
        const user = await this.usersService.getUserByEmail(data.email);
        if (!user) throw new BadRequestException('User does not exist');
        const passwordMatches = await bcrypt.compare(
            data.password,
            user.password,
        );
        if (!passwordMatches)
            throw new BadRequestException('Password is incorrect');
        const tokens = await this.getTokens(user.id, user.name);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async logout(userId: number) {
        return this.usersRepository.update(userId, { refreshToken: null });
    }

    async updateRefreshToken(id: number, refreshToken: string) {
        const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
        await this.usersRepository.update(id, {
            refreshToken: hashedRefreshToken,
        });
    }

    async refreshTokens(userId: number, refreshToken: string) {
        const user = await this.usersService.getUserById(userId);
        if (!user || !user.refreshToken)
            throw new ForbiddenException('Access Denied');
        const refreshTokenMatches = await bcrypt.compare(
            refreshToken,
            user.refreshToken,
        );
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.id, user.name);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async getTokens(userId: number, username: string) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: this.configService.get<string>('JWT_ACCESS_SECRET'),
                    expiresIn: '15m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                },
                {
                    secret: this.configService.get<string>(
                        'JWT_REFRESH_SECRET',
                    ),
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }
}
