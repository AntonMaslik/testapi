import { Module } from '@nestjs/common';
import { WorkspaceService } from '../workspaces/workspace/workspace.service';
import { WorkSpaceController } from './workspace/workspace.controller';
import { WorkspaceEntity } from './entity/workspace.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from 'src/tasks/entity/task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WorkspaceEntity,TaskEntity]),
  ],
  providers: [WorkspaceService],
  controllers: [WorkSpaceController]
})
export class WorkspaceModule {}
