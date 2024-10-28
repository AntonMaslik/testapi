import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('task')
export class TaskController {
    @Post()
    public createTask(): string {
        return 'post';
    }

    @Get()
    public getTasks(): string {
        return "get";
    }

    @Delete()
    public removeTask(id: number): string {
        return "delete task"
    }
    
}
