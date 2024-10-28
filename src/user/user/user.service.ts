import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm'
import { UserCreateRequestDto } from '../dto/user-create-request.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ){}

    async getAllUsers(){
        const users = this.usersRepository.find();
        return users
    }

    async getUserById(id: number){
        const user = await this.usersRepository.findOne({
            where: {
                id: id,
            },
        });
        if (user) {
            return user;
        }
        throw new NotFoundException('Could not find the user');
    }

    async createUser(user: UserCreateRequestDto) {
        const newUser = await this.usersRepository.create(user);
        await this.usersRepository.save({
            name: user.name,
            email: user.email,
            password: user.password,
        });
        return newUser
    }

    async deleteById(id: number){
        const user = await this.usersRepository.findOne({
            where: {
                id: id,
            },
        });
        if(!user) {
            return null;
        }
        
        await this.usersRepository.remove(user);
        return user;
    }
}
