import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    Delete,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/auth/roles/roles.enum';
import { CreateWorkspaceDto } from '../dto/create-workspace-dto';
import { UpdateWorkspaceDto } from '../dto/update-workspace-dto';
import { AuthGuard } from 'src/decorators/guard.decorators';

AuthGuard();
@Controller('workspaces')
export class WorkSpaceController {
    constructor(private readonly workspacesService: WorkspaceService) {}

    @Roles(Role.USER)
    @Get(':id')
    getAllTasks(@Param('id') id: number) {
        return this.workspacesService.getAllTasks(id);
    }

    @Roles(Role.USER)
    @Get('tasks/:id')
    getTask(@Param('id') id: number) {
        return this.workspacesService.getTasksByWorkspaceId(id);
    }

    @Roles(Role.USER)
    @Post('create')
    createWorkspace(@Body() createWorkspaceDto: CreateWorkspaceDto) {
        return this.workspacesService.createWorkspace(createWorkspaceDto);
    }

    @Roles(Role.USER)
    @Put(':id')
    updateWorkspace(
        @Param() id: number,
        @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    ) {
        return this.workspacesService.updateWorkspaceById(
            id,
            updateWorkspaceDto,
        );
    }

    @Roles(Role.USER)
    @Delete(':id')
    deleteWorkspace(@Param() id: number) {
        return this.workspacesService.deleteWorkspaceById(id);
    }

    @Roles(Role.ADMIN)
    @Get('of/:id')
    getWorkspacesByIdUser(@Param() id: number) {
        return this.workspacesService.getWorkspacesByIdUser(id);
    }
}
