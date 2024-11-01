import { Module } from '@nestjs/common';
import { TaskController } from './task/task.controller';
import { TaskService } from './task/task.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entity/task.entity';
import { WorkspaceEntity } from 'src/workspaces/entity/workspace.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity, WorkspaceEntity])],
    controllers: [TaskController],
    providers: [TaskService],
})
export class TaskModule {}
