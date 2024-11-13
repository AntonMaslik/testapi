import {
    NotFoundException,
    Injectable,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../entity/tasks.entity';
import { In, Repository, UpdateResult } from 'typeorm';
import { TaskCreateRequestDto } from '../dto/task-create-request.dto';
import { TaskUpdateRequestDto } from '../dto/task-update-request.dto';
import { WorkspaceEntity } from 'src/workspaces/entity/workspace.entity';
import { TaskUpdatePositionRequestDto } from '../dto/task-update-position-request.dto';
import { UserEntity } from 'src/users/entity/user.entity';
import { isAdmin } from 'src/auth/roles/helpers/helperIsAdmin';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly tasksRepository: Repository<TaskEntity>,
        @InjectRepository(WorkspaceEntity)
        private readonly workspacesRepository: Repository<WorkspaceEntity>,
    ) {}

    async createTask(
        user: UserEntity,
        taskCreateRequestDto: TaskCreateRequestDto,
    ): Promise<TaskEntity> {
        const isAdminStatus = await isAdmin(user);

        if (isAdminStatus) {
            return this.tasksRepository.save(taskCreateRequestDto);
        }

        const workspace = await this.workspacesRepository.findOne({
            where: { userId: user.id },
        });

        if (!workspace) {
            throw new ForbiddenException('No access to the workspace');
        }

        return this.tasksRepository.save(taskCreateRequestDto);
    }

    async getTasks(user: UserEntity): Promise<TaskEntity[]> {
        const isAdminStatus = await isAdmin(user);

        if (isAdminStatus) {
            return this.tasksRepository.find();
        }

        const workspaces = await this.workspacesRepository.find({
            where: { userId: user.id },
        });

        if (!workspaces.length) {
            throw new NotFoundException('Workspaces not found!');
        }

        const workspacesUserIds = workspaces.map(
            (workspace) => workspace.userId,
        );

        return this.tasksRepository.find({
            where: { workspaceId: In(workspacesUserIds) },
        });
    }

    async deleteTasks(user: UserEntity, id: number): Promise<TaskEntity> {
        const isAdminStatus = await isAdmin(user);

        if (isAdminStatus) {
            const task = await this.tasksRepository.findOne({
                where: { id },
            });
            return this.tasksRepository.softRemove(task);
        }

        const workspaces = await this.workspacesRepository.find({
            where: { userId: user.id },
        });

        if (!workspaces.length) {
            throw new NotFoundException('Workspaces not found!');
        }

        const workspacesUserIds = workspaces.map(
            (workspace) => workspace.userId,
        );

        const task = await this.tasksRepository.findOne({
            where: {
                id,
                workspaceId: In(workspacesUserIds),
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found!');
        }

        return this.tasksRepository.softRemove(task);
    }

    async updateTask(
        user: UserEntity,
        taskUpdateRequestDto: TaskUpdateRequestDto,
        id: number,
    ): Promise<UpdateResult> {
        const isAdminStatus = await isAdmin(user);

        if (isAdminStatus) {
            return this.tasksRepository.update(id, taskUpdateRequestDto);
        }

        const workspaces = await this.workspacesRepository.find({
            where: { userId: user.id },
        });

        if (!workspaces.length) {
            throw new NotFoundException('Workspaces not found!');
        }

        const workspacesUserIds = workspaces.map(
            (workspace) => workspace.userId,
        );

        const task = await this.tasksRepository.findOne({
            where: {
                id,
                workspaceId: In(workspacesUserIds),
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found!');
        }

        return this.workspacesRepository.update(id, taskUpdateRequestDto);
    }

    async updatePosTask(
        user: UserEntity,
        taskUpdatePositionRequestDto: TaskUpdatePositionRequestDto,
    ): Promise<UpdateResult> {
        const isAdminStatus = await isAdmin(user);

        if (isAdminStatus) {
            return this.tasksRepository.update(
                taskUpdatePositionRequestDto.id,
                taskUpdatePositionRequestDto,
            );
        }

        const workspaces = await this.workspacesRepository.find({
            where: { userId: user.id },
        });

        if (!workspaces.length) {
            throw new NotFoundException('Workspaces not found!');
        }

        const workspacesUserIds = workspaces.map(
            (workspace) => workspace.userId,
        );

        const task = await this.tasksRepository.findOne({
            where: {
                id: taskUpdatePositionRequestDto.id,
                workspaceId: In(workspacesUserIds),
            },
        });

        if (!task) {
            throw new NotFoundException('Task not found!');
        }

        return this.tasksRepository.update(
            taskUpdatePositionRequestDto.id,
            taskUpdatePositionRequestDto,
        );
    }
}
