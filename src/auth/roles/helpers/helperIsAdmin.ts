import { UserEntity } from 'src/users/entity/user.entity';

import { Role } from '../roles/roles.enum';

export async function isAdmin(user: UserEntity): Promise<boolean> {
    return user.roles.some(({ name }) => name === Role.ADMIN);
}
