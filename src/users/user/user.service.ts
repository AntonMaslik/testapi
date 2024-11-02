import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { Repository } from 'typeorm';
import { UserCreateRequestDto } from '../dto/user-create-request.dto';
import { UserUpdateRequestDto } from '../dto/user-update-request.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
    ) {}

    async getAllUsers() {
        return this.usersRepository.find();
    }

    async getUserById(id: number) {
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

    async getUserByEmail(email: string) {
        const user = await this.usersRepository.findOne({
            where: {
                email: email,
            },
        });
        if (user) {
            return user;
        }
        return null;
    }

    async create(createUserDto: UserCreateRequestDto): Promise<UserEntity> {
        return this.usersRepository.save(createUserDto);
    }

    async deleteById(id: number): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!user) {
            return null;
        }

        await this.usersRepository.softRemove(user);
        return user;
    }

    async updateUserById(
        id: number,
        userDto: UserUpdateRequestDto,
    ): Promise<UserEntity> {
        let user = await this.usersRepository.findOne({
            where: {
                id: id,
            },
        });
        return this.usersRepository.save({
            ...user,
            ...userDto,
        });
    }
}
