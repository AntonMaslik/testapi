import { Controller, Delete, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TaskCreateRequestDto } from '../dto/task-create-request.dto';
import { TaskService } from './task.service';
import { TaskEntity } from '../entity/task.entity';
import { TaskUpdateRequestDto } from '../dto/task-update-request.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';


@Controller('tasks')
export class TaskController {
    constructor(private taskServices: TaskService){}

    @UseGuards(AuthGuard('jwt'))
    @Post()
    postTask(@Body() task:TaskCreateRequestDto): Promise<void> {
        this.taskServices.createTask(task);
        console.log(task);
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }
    
    @UseGuards(AuthGuard('jwt'))
    @Get('all')
    getAllTasks(): Promise<TaskEntity[]> {
        return this.taskServices.getAllTasks();
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    getTask(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
        return this.taskServices.getTaskById(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete(':id')
    deleteTask(@Param('id', ParseIntPipe) id: number){
        return this.taskServices.deleteTask(id);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put(':id')
    updateTask(@Body() task: TaskUpdateRequestDto): Promise<TaskEntity> {
       return this.taskServices.updateTask(task);
       
    }

}
