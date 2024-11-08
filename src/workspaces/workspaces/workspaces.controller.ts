import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Delete,
    ParseIntPipe,
} from '@nestjs/common';
import { WorkspaceService } from './workspaces.service';
import { CreateWorkspaceDto } from '../dto/create-workspace-dto';
import { UpdateWorkspaceDto } from '../dto/update-workspace-dto';
import { AuthGuard } from 'src/decorators/guard.decorators';
import { WorkspaceEntity } from '../entity/workspace.entity';
import { ExtractUser } from 'src/decorators/extractUser.decorator';
import { UserEntity } from 'src/users/entity/user.entity';
import { UpdateResult } from 'typeorm';
import { BasicInfo } from 'src/types/basicInfo';
import { TaskEntity } from 'src/tasks/entity/tasks.entity';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Workspaces')
@AuthGuard()
@Controller('workspaces')
export class WorkSpaceController {
    constructor(private readonly workspacesService: WorkspaceService) {}

    @Post()
    createWorkspace(
        @ExtractUser() user: UserEntity,
        @Body() createWorkspaceDto: CreateWorkspaceDto,
    ): Promise<WorkspaceEntity> {
        return this.workspacesService.createWorkspace(user, createWorkspaceDto);
    }

    @Put()
    updateWorkspaceById(
        @ExtractUser() user: UserEntity,
        @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    ): Promise<UpdateResult> {
        return this.workspacesService.updateWorkspaceById(
            user,
            updateWorkspaceDto,
        );
    }

    @Delete(':id')
    deleteWorkspaceById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<WorkspaceEntity> {
        return this.workspacesService.deleteWorkspaceById(user, id);
    }

    @Get('tasks/:id')
    getTasksInWorkspaceById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<TaskEntity[]> {
        return this.workspacesService.getTasksInWorkspaceById(user, id);
    }

    @Get(':id')
    getWorkspaceBasicInfoById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BasicInfo> {
        return this.workspacesService.getWorkspaceBasicInfoById(user, id);
    }

    @Get('of/:id')
    getWorkspacesOfByUserId(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<WorkspaceEntity[]> {
        return this.workspacesService.getWorkspaceOfByUserId(user, id);
    }
}
