import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspaces/workspaces.service';
import { WorkSpaceController } from './workspaces/workspaces.controller';
import { WorkspaceEntity } from './entity/workspace.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from 'src/tasks/entity/tasks.entity';

@Module({
    imports: [TypeOrmModule.forFeature([WorkspaceEntity, TaskEntity])],
    providers: [WorkspaceService],
    controllers: [WorkSpaceController],
})
export class WorkspaceModule {}
