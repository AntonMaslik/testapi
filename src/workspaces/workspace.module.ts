import { Module } from '@nestjs/common';
import { WorkspaceService } from './workspace/workspace.service';

@Module({
  providers: [WorkspaceService]
})
export class WorkspaceModule {}
