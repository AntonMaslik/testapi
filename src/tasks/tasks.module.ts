import { Module } from '@nestjs/common';
import { TaskController } from './tasks/tasks.controller';
import { TaskService } from './tasks/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entity/tasks.entity';
import { WorkspaceEntity } from 'src/workspaces/entity/workspace.entity';

@Module({
    imports: [TypeOrmModule.forFeature([TaskEntity, WorkspaceEntity])],
    controllers: [TaskController],
    providers: [TaskService],
})
export class TaskModule {}
