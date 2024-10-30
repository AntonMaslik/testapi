import { Controller, Delete, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TaskCreateRequestDto } from '../dto/task-create-request.dto';
import { TaskService } from './task.service';
import { TaskEntity } from '../entity/task.entity';
import { TaskUpdateRequestDto } from '../dto/task-update-request.dto';
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from 'src/auth/guards/refreshToken.guard';
import { TaskPositionUpdateDto } from '../dto/task-position-update.dto';
import { UpdateResult } from 'typeorm'


@Controller('tasks')
export class TaskController {
    constructor(private taskServices: TaskService){}


    @UseGuards(RefreshTokenGuard)
    @Post()
    postTask(@Body() task:TaskCreateRequestDto): Promise<TaskEntity> {
        return this.taskServices.createTask(task);
    }
    
    @UseGuards(RefreshTokenGuard)
    @Get('all')
    getAllTasks(): Promise<TaskEntity[]> {
        return this.taskServices.getAllTasks();
    }


    @UseGuards(RefreshTokenGuard)
    @Get(':id')
    getTask(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
        return this.taskServices.getTaskById(id);
    }


    @UseGuards(RefreshTokenGuard)
    @Delete(':id')
    deleteTask(@Param('id', ParseIntPipe) id: number){
        return this.taskServices.deleteTask(id);
    }


    @UseGuards(RefreshTokenGuard)
    @Put(':id')
    updateTask(@Body() task: TaskUpdateRequestDto): Promise<TaskEntity> {
       return this.taskServices.updateTask(task);
       
    }

    @UseGuards(RefreshTokenGuard)
    @Put('update-position')
    updateTaskPosition(@Body() taskPositionUpdateDto: TaskPositionUpdateDto): Promise<UpdateResult> {
       return this.taskServices.updatePosition(taskPositionUpdateDto.id, taskPositionUpdateDto.position);
       
    }

}
