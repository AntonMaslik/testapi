import { UserEntity } from 'src/users/entity/user.entity';
import { Role } from '../roles/roles.enum';

export async function isAdmin(user: UserEntity): Promise<boolean> {
    const userRoles = user.roles.map((role) => role.name);

    if (userRoles.includes(Role.ADMIN)) {
        return true;
    }

    return false;
}
