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
import { UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from 'src/auth/guards/accessToken.guard';
import { TaskPositionUpdateDto } from '../dto/task-position-update.dto';
import { UpdateResult } from 'typeorm';

@Controller('tasks')
export class TaskController {
    constructor(private taskServices: TaskService) {}

    @UseGuards(AccessTokenGuard)
    @Post()
    postTask(@Body() task: TaskCreateRequestDto): Promise<TaskEntity> {
        return this.taskServices.createTask(task);
    }

    @UseGuards(AccessTokenGuard)
    @Get('all')
    getAllTasks(): Promise<TaskEntity[]> {
        return this.taskServices.getAllTasks();
    }

    @UseGuards(AccessTokenGuard)
    @Get(':id')
    getTask(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
        return this.taskServices.getTaskById(id);
    }

    @UseGuards(AccessTokenGuard)
    @Delete(':id')
    deleteTask(@Param('id', ParseIntPipe) id: number) {
        return this.taskServices.deleteTask(id);
    }

    @UseGuards(AccessTokenGuard)
    @Put(':id')
    updateTask(
        @Param() id: number,
        @Body() task: TaskUpdateRequestDto,
    ): Promise<UpdateResult> {
        return this.taskServices.updateTask(id, task);
    }

    @UseGuards(AccessTokenGuard)
    @Put('update-position')
    updateTaskPosition(
        @Body() { id, position }: TaskPositionUpdateDto,
    ): Promise<UpdateResult | NotFoundException> {
        return this.taskServices.updatePosition(id, position);
    }
}
