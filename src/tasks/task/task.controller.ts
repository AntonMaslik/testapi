import { Controller, Delete, Get, Post, Put, Body, Param, ParseIntPipe } from '@nestjs/common';
import { TaskCreateRequestDto } from '../dto/task-create-request.dto';
import { TaskService } from './task.service';
import { TaskEntity } from '../entity/task.entity';
import { TaskUpdateRequestDto } from '../dto/task-update-request.dto';
<<<<<<< Updated upstream
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
=======
<<<<<<< Updated upstream
>>>>>>> Stashed changes

=======
import { UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from 'src/auth/guards/refreshToken.guard';
>>>>>>> Stashed changes

@Controller('tasks')
export class TaskController {
    constructor(private taskServices: TaskService){}

<<<<<<< Updated upstream
    @UseGuards(AuthGuard('jwt'))
=======
<<<<<<< Updated upstream
=======
    @UseGuards(RefreshTokenGuard)
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    @Post()
    postTask(@Body() task:TaskCreateRequestDto): Promise<void> {
        this.taskServices.createTask(task);
        console.log(task);
        return new Promise<void>((resolve, reject) => {
            resolve();
        });
    }
    
<<<<<<< Updated upstream
    @UseGuards(AuthGuard('jwt'))
=======
<<<<<<< Updated upstream
=======
    @UseGuards(RefreshTokenGuard)
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    @Get('all')
    getAllTasks(): Promise<TaskEntity[]> {
        return this.taskServices.getAllTasks();
    }

<<<<<<< Updated upstream
    @UseGuards(AuthGuard('jwt'))
=======
<<<<<<< Updated upstream
=======
    @UseGuards(RefreshTokenGuard)
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    @Get(':id')
    getTask(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
        return this.taskServices.getTaskById(id);
    }

<<<<<<< Updated upstream
    @UseGuards(AuthGuard('jwt'))
=======
<<<<<<< Updated upstream
=======
    @UseGuards(RefreshTokenGuard)
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    @Delete(':id')
    deleteTask(@Param('id', ParseIntPipe) id: number){
        return this.taskServices.deleteTask(id);
    }

<<<<<<< Updated upstream
    @UseGuards(AuthGuard('jwt'))
=======
<<<<<<< Updated upstream
=======
    @UseGuards(RefreshTokenGuard)
>>>>>>> Stashed changes
>>>>>>> Stashed changes
    @Put(':id')
    updateTask(@Body() task: TaskUpdateRequestDto): Promise<TaskEntity> {
       return this.taskServices.updateTask(task);
       
    }

}
