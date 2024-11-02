import { Injectable, NotFoundException } from '@nestjs/common';
import { RolesEntity } from './roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entity/user.entity';
import { roleUpdateDto } from './dto/role-update-dto';

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
        let user = await this.usersRepository.findOne({
            where: {
                id: roleUpdateDto.userId,
            },
        });

        if (!user) {
            throw new NotFoundException('User not find!');
        }

        return this.usersRepository.save({
            ...user,
            roles: roleUpdateDto.roles,
        });
    }
}
