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

AuthGuard();
@Controller('workspaces')
export class WorkSpaceController {
    constructor(private readonly workspacesService: WorkspaceService) {}
}
