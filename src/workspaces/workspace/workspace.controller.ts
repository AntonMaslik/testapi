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

    @Roles(Role.ADMIN)
    @Post('admin')
    createWorkspaceForAdmin(
        createWorkspaceDto: CreateWorkspaceDto,
    ): Promise<WorkspaceEntity> {
        return this.workspacesService.createWorkspaceForAdmin(
            createWorkspaceDto,
        );
    }

    @Roles(Role.ADMIN)
    @Put('admin')
    updateWorkspaceForAdmin(
        updateWorkspaceDto: UpdateWorkspaceDto,
    ): Promise<UpdateResult> {
        return this.workspacesService.updateWorkspaceForAdmin(
            updateWorkspaceDto,
        );
    }

    @Roles(Role.ADMIN)
    @Delete('admin/:id')
    deleteWorkspaceForAdmin(
        @Param('id', ParseIntPipe) workspaceId: number,
    ): Promise<WorkspaceEntity> {
        return this.workspacesService.deleteWorkspaceForAdmin(workspaceId);
    }

    @Roles(Role.ADMIN)
    @Get('admin/:id')
    getWorkspaceByIdForAdmin(
        @Param('id', ParseIntPipe) workspaceId: number,
    ): Promise<WorkspaceEntity> {
        return this.workspacesService.getWorkspaceByIdForAdmin(workspaceId);
    }

    @Roles(Role.ADMIN)
    @Get('admin/of/:id')
    getWorkspaceByIdUserForAdmin(
        @Param('id', ParseIntPipe) userId: number,
    ): Promise<WorkspaceEntity[]> {
        return this.workspacesService.getWorkspacesByIdUserForAdmin(userId);
    }

    @Roles(Role.ADMIN)
    @Get('admin/basic-info/:id')
    getTasksBasicInfoByWorkspaceIdForAdmin(
        @Param('id', ParseIntPipe) workspaceId: number,
    ): Promise<BasicInfo> {
        return this.workspacesService.getTasksBasicInfoByWorkspaceIdForAdmin(
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
}
