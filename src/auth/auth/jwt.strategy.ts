import { Injectable, NotFoundException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserEntity } from 'src/users/entity/user.entity';
import { Repository} from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm';

type JwtPayload = {
  sub: number;
  username: string;
};

export interface RequestModel extends Request {
    userDb: any
}

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

  validate(request: RequestModel, payload: JwtPayload) {
    const foundUser = this.usersRepository.find({ where: {id: payload.sub}})

    if(!foundUser){
      throw new NotFoundException("User not found!")
    }

    request.userDb = foundUser
    
    return payload; 
  }
}