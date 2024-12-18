import { Injectable, NotFoundException } from '@nestjs/common';

import { RolesEntity } from '../entity/roles.entity';
import { UserEntity } from 'src/users/entity/user.entity';

import { roleUpdateDto } from '../dto/role-update-dto';

import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,

        @InjectRepository(RolesEntity)
        private rolesRepository: Repository<RolesEntity>,
    ) {}

    async updateRoleByIdUser(
        roleUpdateDto: roleUpdateDto,
    ): Promise<UserEntity> {
        const userFound = await this.usersRepository.findOne({
            where: {
                id: roleUpdateDto.id,
            },
            relations: ['roles'],
        });

        if (!userFound) {
            throw new NotFoundException('User not find!');
        }

        const roles = await this.rolesRepository.findBy({
            name: In(roleUpdateDto.roles),
        });

        userFound.roles = roles;

        return this.usersRepository.save(userFound);
    }
}
