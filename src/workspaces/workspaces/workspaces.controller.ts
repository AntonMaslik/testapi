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

import { AuthGuard } from 'src/decorators/guards.decorators';
import { ExtractUser } from 'src/decorators/extractUser.decorator';

import { WorkspaceEntity } from '../entity/workspace.entity';
import { UserEntity } from 'src/users/entity/user.entity';
import { TaskEntity } from 'src/tasks/entity/tasks.entity';

import { UpdateResult } from 'typeorm';
import { BasicInfo } from 'src/types/basicInfo';

import {
    ApiBearerAuth,
    ApiForbiddenResponse,
    ApiNotFoundResponse,
    ApiOperation,
    ApiTags,
} from '@nestjs/swagger';

@ApiTags('Workspaces')
@AuthGuard()
@ApiBearerAuth()
@Controller('workspaces')
export class WorkSpaceController {
    constructor(private readonly workspacesService: WorkspaceService) {}

    @ApiOperation({ summary: 'Create workspace' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @Post()
    createWorkspace(
        @ExtractUser() user: UserEntity,
        @Body() createWorkspaceDto: CreateWorkspaceDto,
    ): Promise<WorkspaceEntity> {
        return this.workspacesService.createWorkspace(user, createWorkspaceDto);
    }

    @ApiOperation({ summary: 'Update workspace' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
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
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    @Delete(':id')
    deleteWorkspaceById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<WorkspaceEntity> {
        return this.workspacesService.deleteWorkspaceById(user, id);
    }

    @ApiOperation({ summary: 'Get tasks in workspace by id' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    @Get('tasks/:id')
    getTasksInWorkspaceById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<TaskEntity[]> {
        return this.workspacesService.getTasksInWorkspaceById(user, id);
    }

    @ApiOperation({ summary: 'Get basic info by id' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    @Get(':id')
    getWorkspaceBasicInfoById(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BasicInfo> {
        return this.workspacesService.getWorkspaceBasicInfoById(user, id);
    }

    @ApiOperation({ summary: 'Get workspace by user id' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiNotFoundResponse({ description: 'Not found' })
    @Get('of/:id')
    getWorkspacesOfByUserId(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<WorkspaceEntity[]> {
        return this.workspacesService.getWorkspaceOfByUserId(user, id);
    }
}
