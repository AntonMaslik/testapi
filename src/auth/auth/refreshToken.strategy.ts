import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/users/entity/user.entity';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';

type JwtPayload = {
    sub: number;
    username: string;
    userDb: UserEntity;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh',
) {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                    return request.cookies.refreshToken;
                },
            ]),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const refreshToken = req
            .get('Authorization')
            .replace('Bearer', '')
            .trim();

        const foundUser = await this.usersRepository.findOne({
            where: { id: payload.sub },
            relations: ['roles'],
        });

        if (!foundUser) {
            throw new NotFoundException('User not found!');
        }

        return { ...payload, refreshToken, userDb: foundUser };
    }
}
