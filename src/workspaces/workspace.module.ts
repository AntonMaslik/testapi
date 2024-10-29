import { Module } from '@nestjs/common';
import { WorkspaceService } from '../workspaces/workspace/workspace.service';
import { WorkSpaceController } from './workspace/workspace.controller';

@Module({
  providers: [WorkspaceService],
  controllers: [WorkSpaceController]
})
export class WorkspaceModule {}
