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
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Workspaces')
@AuthGuard()
@ApiBearerAuth()
@Controller('workspaces')
export class WorkSpaceController {
    constructor(private readonly workspacesService: WorkspaceService) {}

    @ApiOperation({ summary: 'Create workspace' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @Post()
    createWorkspace(
        @ExtractUser() user: UserEntity,
        @Body() createWorkspaceDto: CreateWorkspaceDto,
    ): Promise<WorkspaceEntity> {
        return this.workspacesService.createWorkspace(user, createWorkspaceDto);
    }

    @ApiOperation({ summary: 'Update workspace' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Workspace not found!' })
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

    @ApiOperation({ summary: 'Delete workspace' })
    @ApiResponse({ status: 401, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found!' })
    @Delete(':id')
    deleteWorkspaceById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<WorkspaceEntity> {
        return this.workspacesService.deleteWorkspaceById(user, id);
    }

    @ApiOperation({ summary: 'Get tasks in workspace by id' })
    @ApiResponse({ status: 401, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found!' })
    @Get('tasks/:id')
    getTasksInWorkspaceById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<TaskEntity[]> {
        return this.workspacesService.getTasksInWorkspaceById(user, id);
    }

    @ApiOperation({ summary: 'Get basic info by id' })
    @ApiResponse({ status: 401, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found!' })
    @Get(':id')
    getWorkspaceBasicInfoById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BasicInfo> {
        return this.workspacesService.getWorkspaceBasicInfoById(user, id);
    }

    @ApiOperation({ summary: 'Get workspace by user id' })
    @ApiResponse({ status: 401, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found!' })
    @Get('of/:id')
    getWorkspacesOfByUserId(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<WorkspaceEntity[]> {
        return this.workspacesService.getWorkspaceOfByUserId(user, id);
    }
}
