import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/users/entity/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { UserService } from 'src/users/user/user.service';
import { RolesService } from '../roles/roles.service';
import { RolesEntity } from '../roles/roles.entity';

type JwtPayload = {
    sub: number;
    username: string;
    userDb: UserEntity;
    roles: RolesEntity[];
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_ACCESS_SECRET,
        });
    }

    async validate(_request: Request, payload: JwtPayload) {
        const foundUser = await this.usersRepository.findOne({
            where: { id: payload.sub },
            relations: ['roles'],
        });

        if (!foundUser) {
            throw new NotFoundException('User not found!');
        }

        return {
            ...payload,
            userDb: foundUser,
            roles: foundUser.roles.map(({ roleName }) => roleName),
        };
    }
}
