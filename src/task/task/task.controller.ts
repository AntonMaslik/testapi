import { Controller, Delete, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TaskCreateRequestDto } from '../dto/task-create-request.dto';
import { TaskService } from './task.service';
import { TaskEntity } from '../entity/task.entity';
import { TaskUpdateRequestDto } from '../dto/task-update-request.dto';


@Controller('tasks')
export class TaskController {
    constructor(private taskServices: TaskService){}

    @Post()
    postTask(@Body() task:TaskCreateRequestDto): Promise<void> {
        this.taskServices.createTask(task);
        console.log(task);
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }
    
    @Get('all')
    getAllTasks(): Promise<TaskEntity[]> {
        return this.taskServices.getAllTasks();
    }

    @Get(':id')
    getTask(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
        return this.taskServices.getTaskById(id);
    }

    @Delete(':id')
    deleteTask(@Param('id', ParseIntPipe) id: number){
        return this.taskServices.deleteTask(id);
    }

    @Put(':id')
    updateTask(@Body() task: TaskUpdateRequestDto): Promise<TaskEntity> {
       return this.taskServices.updateTask(task);
       
    }

}
