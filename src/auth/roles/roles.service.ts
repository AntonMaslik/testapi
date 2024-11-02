import { Injectable } from '@nestjs/common';
import { RolesEntity } from './roles.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { UserService } from 'src/users/user/user.service';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(RolesEntity)
        private rolesRepository: Repository<RolesEntity>,
        private usersService: UserService,
    ) {}

    // async getRoleByName(roleName: string): Promise<RolesEntity> {
    //     return this.rolesRepository.findOne({ where: { roleName } });
    // }

    // // getUserRoles(userId: number)
    // async getRolesByUserId(id: number): Promise<RolesEntity[]> {
    //     await this.usersService.getUserById(id)

    //     return this.rolesRepository.find({
    //         where: { users: {id: In()}  },
    //     });
    // }
}
