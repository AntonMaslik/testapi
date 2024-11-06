import {
    NotFoundException,
    Injectable,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../entity/tasks.entity';
import { In, Repository, UpdateResult } from 'typeorm';
import { TaskCreateRequestDto } from '../dto/task-create-request.dto';
import { TaskUpdateRequestDto } from '../dto/task-update-request.dto';
import { WorkspaceEntity } from 'src/workspaces/entity/workspace.entity';
import { TaskUpdatePositionRequestDto } from '../dto/task-update-position-request.dto';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly tasksRepository: Repository<TaskEntity>,
        @InjectRepository(WorkspaceEntity)
        private readonly workspacesRepository: Repository<WorkspaceEntity>,
    ) {}

    async createTaskForAdmin(
        taskCreateRequestDto: TaskCreateRequestDto,
    ): Promise<TaskEntity> {
        return this.tasksRepository.save(taskCreateRequestDto);
    }

    async updateTaskForAdmin(
        taskUpdateRequestDto: TaskUpdateRequestDto,
    ): Promise<UpdateResult> {
        return this.tasksRepository.update(
            { id: taskUpdateRequestDto.id },
            taskUpdateRequestDto,
        );
    }

    async deleteTaskForAdmin(id: number): Promise<TaskEntity> {
        const task = await this.tasksRepository.findOne({ where: { id: id } });

        return this.tasksRepository.remove(task);
    }

    async getTaskByIdForAdmin(id: number): Promise<TaskEntity> {
        return this.tasksRepository.findOne({
            where: { id: id },
            relations: ['workspace'],
        });
    }

    async getAllTaskForAdmin(): Promise<TaskEntity[]> {
        return this.tasksRepository.find();
    }

    async createTaskForUser(
        userId: number,
        taskCreateRequestDto: TaskCreateRequestDto,
    ): Promise<TaskEntity> {
        if (
            await this.checkWorkspaceOwnedUser(
                userId,
                taskCreateRequestDto.workspaceId,
            )
        ) {
            return await this.tasksRepository.save(taskCreateRequestDto);
        }
    }

    async updateTaskForUser(
        userId: number,
        taskUpdateRequestDto: TaskUpdateRequestDto,
    ): Promise<UpdateResult> {
        if (
            await this.checkWorkspaceOwnedUser(
                userId,
                taskUpdateRequestDto.workspaceId,
            )
        ) {
            const task = await this.tasksRepository.findOne({
                where: { id: taskUpdateRequestDto.id },
            });
            return await this.tasksRepository.update(
                task.id,
                taskUpdateRequestDto,
            );
        }
    }

    async deleteTaskForUser(
        userId: number,
        taskId: number,
    ): Promise<TaskEntity> {
        const task = await this.tasksRepository.findOne({
            where: {
                id: taskId,
            },
        });
        if (await this.checkWorkspaceOwnedUser(userId, task.workspaceId)) {
            return this.tasksRepository.softRemove(task);
        }
    }

    async getAllTaskForUser(userId: number): Promise<TaskEntity[]> {
        const workspacesUserIds = await this.workspacesRepository
            .createQueryBuilder('workspaces')
            .select(['workspaces.id'])
            .where('workspaces.userId = :userId', { userId })
            .getMany();

        const tasks = await this.tasksRepository.find({
            where: {
                workspaceId: In(
                    workspacesUserIds.map((workspace) => workspace.id),
                ),
            },
            relations: ['workspace'],
        });

        return tasks;
    }

    async getTaskByIdForUser(id: number, userId: number): Promise<TaskEntity> {
        const workspacesUserIds = await this.workspacesRepository
            .createQueryBuilder('workspaces')
            .select(['workspaces.id'])
            .where('workspaces.userId = :userId', { userId })
            .getMany();

        const task = await this.tasksRepository.findOne({
            where: {
                id: id,
                workspaceId: In(
                    workspacesUserIds.map((workspace) => workspace.id),
                ),
            },
            relations: ['workspace'],
        });

        return task;
    }

    async updatePositionTaskByIdForUser(
        userId: number,
        taskUpdatePositionRequestDto: TaskUpdatePositionRequestDto,
    ): Promise<UpdateResult> {
        const task = await this.tasksRepository.findOne({
            where: { id: taskUpdatePositionRequestDto.id },
        });

        await this.checkWorkspaceOwnedUser(userId, task.workspaceId);

        return this.tasksRepository.update(
            taskUpdatePositionRequestDto.id,
            taskUpdatePositionRequestDto,
        );
    }

    async updatePositionTaskByIdForAdmin(
        taskUpdatePositionRequestDto: TaskUpdatePositionRequestDto,
    ): Promise<UpdateResult> {
        return this.tasksRepository.update(
            taskUpdatePositionRequestDto.id,
            taskUpdatePositionRequestDto,
        );
    }

    async checkWorkspaceOwnedUser(
        userId: number,
        workspaceId: number,
    ): Promise<boolean> {
        const workspacesUserIds = await this.workspacesRepository
            .createQueryBuilder('workspaces')
            .select(['workspaces.id'])
            .where('workspaces.userId = :userId', { userId })
            .getMany();

        if (
            workspacesUserIds
                .map((workspace) => workspace.id)
                .includes(workspaceId)
        ) {
            return true;
        } else {
            throw new BadRequestException(
                'Workspaces not found or not owned user!',
            );
        }
    }
}
