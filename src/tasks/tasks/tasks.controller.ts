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
import { AuthGuard } from 'src/decorators/guards.decorators';
import { ExtractUser } from 'src/decorators/extractUser.decorator';
import { UserEntity } from 'src/users/entity/user.entity';
import { TaskUpdatePositionRequestDto } from '../dto/task-update-position-request.dto';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';

@AuthGuard()
@ApiTags('Tasks')
@ApiBearerAuth()
@Controller('tasks')
export class TaskController {
    constructor(private tasksServices: TaskService) {}

    @ApiOperation({ summary: 'Update task position' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @ApiResponse({
        status: 200,
        description: 'Update task',
        type: UpdateResult,
    })
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

    @ApiOperation({ summary: 'Create task' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @Post()
    createTask(
        @ExtractUser() user: UserEntity,
        @Body() taskCreateRequestDto: TaskCreateRequestDto,
    ): Promise<TaskEntity> {
        return this.tasksServices.createTask(user, taskCreateRequestDto);
    }

    @ApiOperation({ summary: 'Get task' })
    @ApiResponse({ status: 403, description: 'Forbidden.' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @Get()
    getTasks(@ExtractUser() user: UserEntity): Promise<TaskEntity[]> {
        return this.tasksServices.getTasks(user);
    }

    @ApiOperation({ summary: 'Delete task' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @Delete(':id')
    deleteTask(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<TaskEntity> {
        return this.tasksServices.deleteTasks(user, id);
    }

    @ApiOperation({ summary: 'Update task' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiResponse({ status: 404, description: 'Not found' })
    @Put(':id')
    updateTask(
        @ExtractUser() user: UserEntity,
        @Param('id', ParseIntPipe) id: number,
        @Body() taskUpdateRequestDto: TaskUpdateRequestDto,
    ): Promise<UpdateResult> {
        return this.tasksServices.updateTask(user, taskUpdateRequestDto, id);
    }
}
