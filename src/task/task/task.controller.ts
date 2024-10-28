import { Controller, Delete, Get, Post, Put, Body } from '@nestjs/common';
import { TaskCreateRequestDto } from '../dto/task-create-request.dto/task-create-request.dto';
import { TaskService } from './task.service';
import { TaskEntity } from '../entity/task.entity/task.entity';
import { TaskUpdateRequestDto } from '../dto/task-update-request.dto/task-update-request.dto';


@Controller('task')
export class TaskController {
    constructor(private taskServices: TaskService){}

    @Post()
    public postTask(@Body() task:TaskCreateRequestDto): Promise<void> {
        this.taskServices.createTask(task);
        console.log(task);
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }

    @Get()
    public getTask(@Body('uuid') uuid: string): Promise<TaskEntity> {
        return this.taskServices.getTaskById(uuid);
    }

    @Get('/all')
    public getAllTasks(): Promise<TaskEntity[]> {
        return this.taskServices.getAllTasks();
    }

    @Delete()
    public deleteTask(@Body('uuid') uuid: string): Promise<void> {
        this.taskServices.deleteTask(uuid);
        return new Promise<void>((resolve, reject) => {
            resolve();
        })
    }

    @Put()
    public updateTask(@Body() task: TaskUpdateRequestDto): Promise<void> {
       this.taskServices.updateTask(task);
       return new Promise<void>((resolve, reject) => {
            resolve();
       }) 
    }

}
