import {
    Controller,
    Delete,
    Get,
    Post,
    Put,
    Body,
    Param,
    ParseIntPipe,
    NotFoundException,
} from '@nestjs/common';
import { TaskCreateRequestDto } from '../dto/task-create-request.dto';
import { TaskService } from './task.service';
import { TaskEntity } from '../entity/task.entity';
import { TaskUpdateRequestDto } from '../dto/task-update-request.dto';
import { TaskPositionUpdateDto } from '../dto/task-position-update.dto';
import { UpdateResult } from 'typeorm';
import { AuthGuard } from 'src/decorators/guard.decorators';
import { Role } from 'src/auth/roles/roles.enum';
import { Roles } from 'src/decorators/roles.decorator';

@AuthGuard()
@Controller('tasks')
export class TaskController {
    constructor(private taskServices: TaskService) {}

    @Roles(Role.USER)
    @Post()
    createTask(@Body() task: TaskCreateRequestDto): Promise<TaskEntity> {
        return this.taskServices.createTask(task);
    }

    @Roles(Role.USER)
    @Get('all')
    getAllTasks(): Promise<TaskEntity[]> {
        return this.taskServices.getAllTasks();
    }

    @Roles(Role.USER)
    @Get(':id')
    getTask(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
        return this.taskServices.getTaskById(id);
    }

    @Roles(Role.ADMIN)
    @Delete(':id')
    deleteTask(@Param('id', ParseIntPipe) id: number) {
        return this.taskServices.deleteTask(id);
    }

    @Roles(Role.ADMIN)
    @Put(':id')
    updateTask(
        @Param() id: number,
        @Body() task: TaskUpdateRequestDto,
    ): Promise<UpdateResult> {
        return this.taskServices.updateTask(id, task);
    }

    @Roles(Role.USER)
    @Put('update-position')
    updateTaskPosition(
        @Body() { id, position }: TaskPositionUpdateDto,
    ): Promise<UpdateResult | NotFoundException> {
        return this.taskServices.updatePosition(id, position);
    }
}
