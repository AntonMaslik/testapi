import { Module } from '@nestjs/common';
import { UserService } from './users/users.service';
import { UserController } from './users/users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entity//user.entity';
import { RolesEntity } from 'src/auth/roles/roles.entity';
import { TaskEntity } from 'src/tasks/entity/tasks.entity';
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
