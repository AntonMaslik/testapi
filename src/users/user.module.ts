import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity//user.entity';
<<<<<<< Updated upstream:src/users/user.module.ts
import { RolesEntity } from 'src/auth/roles/roles.entity';
import { TaskEntity } from 'src/tasks/entity/task.entity';
=======
import { RolesEntity } from 'src/auth/roles/entity/roles.entity';
import { TaskEntity } from 'src/tasks/entity/tasks.entity';
>>>>>>> Stashed changes:src/users/users.module.ts
import { WorkspaceEntity } from 'src/workspaces/entity/workspace.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            UserEntity,
            RolesEntity,
            TaskEntity,
            WorkspaceEntity,
        ]),
    ],
    providers: [UserService],
    controllers: [UserController],
})
export class UserModule {}
