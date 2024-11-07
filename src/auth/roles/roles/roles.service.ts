import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { RolesEntity } from '../entity/roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entity/user.entity';
import { roleUpdateDto } from '../dto/role-update-dto';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,

        @InjectRepository(RolesEntity)
        private rolesRepository: Repository<RolesEntity>,
    ) {}

    async updateRoleByIdUser(
        user: UserEntity,
        roleUpdateDto: roleUpdateDto,
    ): Promise<UserEntity> {
        if (isAdmin(user)) {
            throw new ForbiddenException('Not access!');
        }

        let userFound = await this.usersRepository.findOne({
            where: {
                id: roleUpdateDto.userId,
            },
        });

        if (!userFound) {
            throw new NotFoundException('User not find!');
        }

        return this.usersRepository.save({
            ...user,
            roles: roleUpdateDto.roles,
        });
    }
}
