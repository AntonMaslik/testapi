import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
    Request,
    Req,
    Delete,
} from '@nestjs/common';
import { WorkspaceService } from './workspace.service';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { CreateWorkspaceDto } from '../dto/create-workspace-dto';
import { UpdateWorkspaceDto } from '../dto/update-workspace-dto';

// TODO: one decorator (UseGuards)

@Controller('workspaces')
export class WorkSpaceController {
    constructor(private readonly workspacesService: WorkspaceService) {}

    @Get(':id')
    getAllTasks(@Param('id') id: number) {
        return this.workspacesService.getAllTasks(id);
    }

    @Get('tasks/:id')
    getTask(@Param('id') id: number) {
        return this.workspacesService.getTasksByWorkspaceId(id);
    }

    @UseGuards(AccessTokenGuard)
    @Post('create')
    createWorkspace(@Body() createWorkspaceDto: CreateWorkspaceDto) {
        return this.workspacesService.createWorkspace(createWorkspaceDto);
    }

    @UseGuards(AccessTokenGuard)
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

    @UseGuards(AccessTokenGuard)
    @Delete(':id')
    deleteWorkspace(@Param() id: number) {
        return this.workspacesService.deleteWorkspaceById(id);
    }
}
