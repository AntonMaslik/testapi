import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace/workspace.service';
import { WorkSpaceController } from './workspace/work-space.controller';

@Module({
  providers: [WorkspaceService],
  controllers: [WorkSpaceController]
})
export class WorkspaceModule {}
