import {
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Body,
    Param,
    ParseIntPipe,
} from '@nestjs/common';
import { TaskCreateRequestDto } from '../dto/task-create-request.dto';
import { TaskService } from './tasks.service';
import { TaskEntity } from '../entity/tasks.entity';
import { TaskUpdateRequestDto } from '../dto/task-update-request.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from 'src/decorators/guard.decorators';
import { Role } from 'src/auth/roles/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';
import { ExtractUser } from 'src/decorators/extractUser.decorator';
import { UserEntity } from 'src/users/entity/user.entity';
import { TaskUpdatePositionRequestDto } from '../dto/task-update-position-request.dto';

@AuthGuard()
@Controller('tasks')
export class TaskController {
    constructor(private taskServices: TaskService) {}

    @Roles(Role.USER)
    @Get('all')
    getTaskAllForUser(@ExtractUser() user: UserEntity) {
        return this.taskServices.getAllTaskForUser(user.id);
    }

    @Roles(Role.ADMIN)
    @Get('admin/all')
    getTaskAllForAdmin(id: number): Promise<TaskEntity[]> {
        return this.taskServices.getAllTaskForAdmin();
    }

    @Roles(Role.USER)
    @Put('update-position')
    updatePositionTaskByIdForUser(
        @ExtractUser() user: UserEntity,
        @Body() taskUpdatePositionRequestDto: TaskUpdatePositionRequestDto,
    ) {
        return this.taskServices.updatePositionTaskByIdForUser(
            user.id,
            taskUpdatePositionRequestDto,
        );
    }

    @Roles(Role.ADMIN)
    @Put('update-position')
    updatePositionTaskByIdForAdmin(
        @Body() taskUpdatePositionRequestDto: TaskUpdatePositionRequestDto,
    ) {
        return this.taskServices.updatePositionTaskByIdForAdmin(
            taskUpdatePositionRequestDto,
        );
    }

    @Roles(Role.ADMIN)
    @Post('admin')
    createTaskForAdmin(
        @Body() taskCreateRequestDto: TaskCreateRequestDto,
    ): Promise<TaskEntity> {
        return this.taskServices.createTaskForAdmin(taskCreateRequestDto);
    }

    @Roles(Role.ADMIN)
    @Put('admin')
    updateTaskForAdmin(
        @Body() taskUpdateRequestDto: TaskUpdateRequestDto,
    ): Promise<UpdateResult> {
        return this.taskServices.updateTaskForAdmin(taskUpdateRequestDto);
    }

    @Roles(Role.ADMIN)
    @Delete('admin/:id')
    deleteTaskForAdmin(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<TaskEntity> {
        return this.taskServices.deleteTaskForAdmin(id);
    }

    @Roles(Role.ADMIN)
    @Get('admin/:id')
    getTaskByIdForAdmin(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<TaskEntity> {
        return this.taskServices.getTaskByIdForAdmin(id);
    }

    @Roles(Role.USER)
    @Post()
    createTaskForUser(
        @ExtractUser() user: UserEntity,
        @Body() taskCreateRequestDto: TaskCreateRequestDto,
    ) {
        return this.taskServices.createTaskForUser(
            user.id,
            taskCreateRequestDto,
        );
    }

    @Roles(Role.USER)
    @Put()
    updateTaskForUser(
        @ExtractUser() user: UserEntity,
        @Body() taskUpdateRequestDto: TaskUpdateRequestDto,
    ): Promise<UpdateResult> {
        return this.taskServices.updateTaskForUser(
            user.id,
            taskUpdateRequestDto,
        );
    }

    @Roles(Role.USER)
    @Delete(':id')
    deleteTaskForUser(
        @Param('id', ParseIntPipe) id: number,
        @ExtractUser() user: UserEntity,
    ): Promise<TaskEntity> {
        return this.taskServices.deleteTaskForUser(user.id, id);
    }

    @Roles(Role.USER)
    @Get(':id')
    getTaskByIdForUser(
        @Param('id', ParseIntPipe) id: number,
        @ExtractUser() user: UserEntity,
    ) {
        return this.taskServices.getTaskByIdForUser(id, user.id);
    }
}
