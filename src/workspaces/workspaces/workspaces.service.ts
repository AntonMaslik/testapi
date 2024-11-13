import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/tasks/entity/tasks.entity';
import { In, Repository, UpdateResult } from 'typeorm';
import { CreateWorkspaceDto } from '../dto/create-workspace-dto';
import { UpdateWorkspaceDto } from '../dto/update-workspace-dto';
import { WorkspaceEntity } from '../entity/workspace.entity';
import { BasicInfo } from 'src/types/basicInfo';
import { UserEntity } from 'src/users/entity/user.entity';
import { isAdmin } from 'src/auth/roles/helpers/helperIsAdmin';

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectRepository(WorkspaceEntity)
        private workspacesRepository: Repository<WorkspaceEntity>,
        @InjectRepository(TaskEntity)
        private tasksRepository: Repository<TaskEntity>,
    ) {}

    async createWorkspace(
        user: UserEntity,
        createWorkspaceDto: CreateWorkspaceDto,
    ): Promise<WorkspaceEntity> {
        const isAdminStatus = await isAdmin(user);

        if (isAdminStatus) {
            return this.workspacesRepository.save(createWorkspaceDto);
        }

        if (createWorkspaceDto.userId !== user.id) {
            throw new ForbiddenException('Not access!');
        }

        return this.workspacesRepository.save(createWorkspaceDto);
    }

    async updateWorkspaceById(
        user: UserEntity,
        updateWorkspaceDto: UpdateWorkspaceDto,
    ): Promise<UpdateResult> {
        const isAdminStatus = await isAdmin(user);

        if (isAdminStatus) {
            return this.workspacesRepository.update(
                updateWorkspaceDto.id,
                updateWorkspaceDto,
            );
        }

        if (updateWorkspaceDto.userId !== user.id) {
            throw new ForbiddenException('Not access!');
        }

        return this.workspacesRepository.update(
            updateWorkspaceDto.id,
            updateWorkspaceDto,
        );
    }

    async deleteWorkspaceById(
        user: UserEntity,
        id: number,
    ): Promise<WorkspaceEntity> {
        const isAdminStatus = await isAdmin(user);

        if (isAdminStatus) {
            const workspace = await this.workspacesRepository.findOne({
                where: {
                    id,
                },
            });

            if (!workspace) {
                throw new NotFoundException('Not find workspace!');
            }

            const tasksFromWorkspace = await this.workspacesRepository
                .createQueryBuilder('tasks')
                .where('tasks.workspaceId = :id', { id })
                .getMany();

            await this.workspacesRepository.softRemove(tasksFromWorkspace);

            return this.workspacesRepository.softRemove(workspace);
        }

        const workspace = await this.workspacesRepository.findOne({
            where: { id, userId: user.id },
        });

        if (!workspace) {
            throw new NotFoundException('Not find workspace!');
        }

        const tasksFromWorkspace = await this.workspacesRepository
            .createQueryBuilder('tasks')
            .where('tasks.workspaceId = :id', { id })
            .getMany();

        if (tasksFromWorkspace.length) {
            await this.workspacesRepository.softRemove(tasksFromWorkspace);
        }

        return this.workspacesRepository.softRemove(workspace);
    }

    async getTasksInWorkspaceById(
        user: UserEntity,
        id: number,
    ): Promise<TaskEntity[]> {
        const isAdminStatus = await isAdmin(user);

        if (isAdminStatus) {
            return this.tasksRepository.find({
                where: {
                    workspaceId: id,
                },
            });
        }

        const workspaces = await this.workspacesRepository.find({
            where: {
                userId: user.id,
            },
        });

        if (!workspaces.length) {
            throw new NotFoundException('Workspace not found!');
        }

        return this.tasksRepository.find({
            where: {
                workspaceId: In(workspaces.map((workspace) => workspace.id)),
            },
        });
    }

    async getWorkspaceBasicInfoById(
        user: UserEntity,
        id: number,
    ): Promise<BasicInfo> {
        const isAdminStatus = await isAdmin(user);

        if (isAdminStatus) {
            const basicInfo = await this.tasksRepository
                .createQueryBuilder('tasks')
                .leftJoin('tasks.workspace', 'workspaces')
                .select(
                    'COUNT(CASE WHEN tasks.completed = true THEN 1 END)',
                    'completedTasks',
                )
                .addSelect(
                    'COUNT(CASE WHEN tasks.completed = false THEN 1 END)',
                    'notCompletedTasks',
                )
                .addSelect('COUNT(tasks.id)', 'countTasks')
                .where('tasks.workspaceId = :workspaceId', {
                    workspaceId: id,
                })
                .getRawOne();

            return {
                countTaskAll: basicInfo.countTasks,
                countTaskNotCompleted: basicInfo.notCompletedTasks,
                countTaskCompleted: basicInfo.completedTasks,
            };
        }

        const workspace = await this.workspacesRepository.findOne({
            where: { id },
        });

        if (!workspace || user.id !== workspace.userId) {
            throw new ForbiddenException('Not access or not find workspace!');
        }

        const basicInfo = await this.tasksRepository
            .createQueryBuilder('tasks')
            .leftJoin('tasks.workspace', 'workspaces')
            .select(
                'COUNT(CASE WHEN tasks.completed = true THEN 1 END)',
                'completedTasks',
            )
            .addSelect(
                'COUNT(CASE WHEN tasks.completed = false THEN 1 END)',
                'notCompletedTasks',
            )
            .addSelect('COUNT(tasks.id)', 'countTasks')
            .where('tasks.workspaceId = :workspaceId', {
                workspaceId: id,
            })
            .getRawOne();

        return {
            countTaskAll: basicInfo.countTasks,
            countTaskNotCompleted: basicInfo.notCompletedTasks,
            countTaskCompleted: basicInfo.completedTasks,
        };
    }

    async getWorkspaceOfByUserId(
        user: UserEntity,
        userId: number,
    ): Promise<WorkspaceEntity[]> {
        const isAdminStatus = await isAdmin(user);

        if (isAdminStatus) {
            return this.workspacesRepository.find({
                where: { userId },
            });
        }

        if (user.id !== userId) {
            throw new ForbiddenException('Not access!');
        }

        return this.workspacesRepository.find({
            where: { userId },
        });
    }
}
