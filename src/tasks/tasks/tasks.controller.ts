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
import { ExtractUser } from 'src/decorators/extractUser.decorator';
import { UserEntity } from 'src/users/entity/user.entity';
import { TaskUpdatePositionRequestDto } from '../dto/task-update-position-request.dto';
import { ApiTags } from '@nestjs/swagger';

@AuthGuard()
@ApiTags('Tasks')
@Controller('tasks')
export class TaskController {
    constructor(private tasksServices: TaskService) {}

    @Put('update-position')
    updatePosTask(
        @ExtractUser() user: UserEntity,
        @Body() taskUpdatePositionRequestDto: TaskUpdatePositionRequestDto,
    ): Promise<UpdateResult> {
        return this.tasksServices.updatePosTask(
            user,
            taskUpdatePositionRequestDto,
        );
    }

    @Post()
    createTask(
        @ExtractUser() user: UserEntity,
        @Body() taskCreateRequestDto: TaskCreateRequestDto,
    ): Promise<TaskEntity> {
        return this.tasksServices.createTask(user, taskCreateRequestDto);
    }

    @Get()
    getTasks(@ExtractUser() user: UserEntity): Promise<TaskEntity[]> {
        return this.tasksServices.getTasks(user);
    }

    @Delete(':id')
    deleteTask(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<TaskEntity> {
        return this.tasksServices.deleteTasks(user, id);
    }

    @Put(':id')
    updateTask(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
        @Body() taskUpdateRequestDto: TaskUpdateRequestDto,
    ): Promise<UpdateResult> {
        return this.tasksServices.updateTask(user, taskUpdateRequestDto, id);
    }
}
