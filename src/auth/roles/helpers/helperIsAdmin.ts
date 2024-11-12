import { UserEntity } from 'src/users/entity/user.entity';
import { Role } from '../roles/roles.enum';

export async function isAdmin(user: UserEntity): Promise<boolean> {
    const userRoles = user.roles.map((role) => role.name);

    return userRoles.includes(Role.ADMIN);
}
