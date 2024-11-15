import { JwtPayload } from 'jsonwebtoken';
import { RolesEntity } from 'src/auth/roles/entity/roles.entity';
import { UserEntity } from 'src/users/entity/user.entity';

declare global {
    namespace Express {
        export interface User {
            userDb: UserEntity;
            roles: string[];
        }
    }
}
