import { UserEntity } from 'src/users/entity/user.entity';
import { Role } from '../roles/roles.enum';

export async function isAdmin(user: UserEntity): Promise<boolean> {
    if (Role.ADMIN in user.roles) {
        return true;
    }

    return false;
}
