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
import { WorkspaceService } from './workspace.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { CreateWorkspaceDto } from '../dto/create-workspace-dto';
import { UpdateWorkspaceDto } from '../dto/update-workspace-dto';
import { AuthGuard } from 'src/decorators/guard.decorators';
import { WorkspaceEntity } from '../entity/workspace.entity';
import { ExtractUser } from 'src/decorators/extractUser.decorator';
import { UserEntity } from 'src/users/entity/user.entity';
import { UpdateResult } from 'typeorm';
import { BasicInfo } from 'src/types/basicInfo';

@AuthGuard()
@Controller('workspaces')
export class WorkSpaceController {
    constructor(private readonly workspacesService: WorkspaceService) {}

    @Roles(Role.USER)
    @Post()
    createWorkspaceForUser(
        @ExtractUser() user: UserEntity,
        @Body() createWorkspaceDto: CreateWorkspaceDto,
    ): Promise<WorkspaceEntity> {
        return this.workspacesService.createWorkspaceForUser(
            user.id,
            createWorkspaceDto,
        );
    }

    @Roles(Role.USER)
    @Put()
    updateWorkspaceByIdForUser(
        @ExtractUser() user: UserEntity,
        @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    ): Promise<UpdateResult> {
        return this.workspacesService.updateWorkspaceByIdForUser(
            user.id,
            updateWorkspaceDto,
        );
    }

    @Roles(Role.USER)
    @Delete(':id')
    deleteWorkspaceByIdForUser(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) workspaceId: number,
    ): Promise<WorkspaceEntity> {
        return this.workspacesService.deleteWorkspaceByIdForUser(
            user.id,
            workspaceId,
        );
    }

    @Roles(Role.USER)
    @Get(':id')
    getWorkspaceByIdForUser(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) workspaceId: number,
    ): Promise<WorkspaceEntity> {
        return this.workspacesService.getWorkspaceByIdForUser(
            user.id,
            workspaceId,
        );
    }

    @Roles(Role.USER)
    @Get('basic-info/:id')
    getTasksBasicInfoByWorkspaceIdForUser(
        @ExtractUser() user,
        @Param('id', ParseIntPipe) workspaceId: number,
    ): Promise<BasicInfo> {
        return this.workspacesService.getTasksBasicInfoByWorkspaceIdForUser(
            user.id,
            workspaceId,
        );
    }
}
