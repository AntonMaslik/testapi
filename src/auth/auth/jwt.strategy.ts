import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/users/entity/user.entity';
import { Repository} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';

type JwtPayload = {
  sub: number;
  username: string;
  userDb: UserEntity
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_ACCESS_SECRET,
    });
  }

  async validate(request: Request, payload: JwtPayload) {
    const foundUser = await this.usersRepository.findOne({ where: {id: payload.sub}})

    if(!foundUser){
      throw new NotFoundException("User not found!")
    }

    payload.userDb = foundUser

    return payload; 
  }
}