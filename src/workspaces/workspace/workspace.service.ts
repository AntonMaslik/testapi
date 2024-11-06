import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/tasks/entity/task.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateWorkspaceDto } from '../dto/create-workspace-dto';
import { UpdateWorkspaceDto } from '../dto/update-workspace-dto';
import { WorkspaceEntity } from '../entity/workspace.entity';
import { BasicInfo } from 'src/types/basicInfo';

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectRepository(WorkspaceEntity)
        private workspacesRepository: Repository<WorkspaceEntity>,
        @InjectRepository(TaskEntity)
        private tasksRepository: Repository<TaskEntity>,
    ) {}

    async createWorkspaceForAdmin(
        createWorkspaceDto: CreateWorkspaceDto,
    ): Promise<WorkspaceEntity> {
        return await this.workspacesRepository.save(createWorkspaceDto);
    }

    async updateWorkspaceForAdmin(
        updateWorkspaceDto: UpdateWorkspaceDto,
    ): Promise<UpdateResult> {
        return await this.workspacesRepository.update(
            updateWorkspaceDto.id,
            updateWorkspaceDto,
        );
    }

    async deleteWorkspaceForAdmin(
        workspaceId: number,
    ): Promise<WorkspaceEntity> {
        const workspace = await this.workspacesRepository.findOne({
            where: {
                id: workspaceId,
            },
        });

        return this.workspacesRepository.softRemove(workspace);
    }

    async getWorkspaceByIdForAdmin(
        workspaceId: number,
    ): Promise<WorkspaceEntity> {
        return this.workspacesRepository.findOne({
            where: { id: workspaceId },
        });
    }

    async getWorkspacesByIdUserForAdmin(
        userId: number,
    ): Promise<WorkspaceEntity[]> {
        return this.workspacesRepository.find({
            where: {
                userId: userId,
            },
        });
    }

    async createWorkspaceForUser(
        userId: number,
        createWorkspaceDto: CreateWorkspaceDto,
    ): Promise<WorkspaceEntity> {
        createWorkspaceDto.userId = userId;

        if (createWorkspaceDto.userId != userId) {
            throw new ForbiddenException(
                'You may only  create workspace for you',
            );
        }

        return await this.workspacesRepository.save(createWorkspaceDto);
    }

    async updateWorkspaceByIdForUser(
        userId: number,
        updateWorkspaceDto: UpdateWorkspaceDto,
    ): Promise<UpdateResult> {
        updateWorkspaceDto.userId = userId;

        if (updateWorkspaceDto.userId != userId) {
            throw new ForbiddenException(
                'You may only  create workspace for you',
            );
        }

        return await this.workspacesRepository.update(
            updateWorkspaceDto.id,
            updateWorkspaceDto,
        );
    }

    async deleteWorkspaceByIdForUser(
        userId: number,
        workspaceId: number,
    ): Promise<WorkspaceEntity> {
        const workspace = await this.workspacesRepository.findOne({
            where: {
                userId: userId,
                id: workspaceId,
            },
        });

        return this.workspacesRepository.softRemove(workspace);
    }

    async getWorkspaceByIdForUser(
        userId: number,
        workspaceId: number,
    ): Promise<WorkspaceEntity> {
        return await this.workspacesRepository.findOne({
            where: {
                userId: userId,
                id: workspaceId,
            },
        });
    }

    async getTasksBasicInfoByWorkspaceIdForUser(
        userId: number,
        workspaceId: number,
    ): Promise<BasicInfo> {
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
                workspaceId: workspaceId,
            })
            .andWhere('workspaces.userId = :userId', {
                userId: userId,
            })
            .getRawOne();

        console.log(basicInfo);

        return {
            countTaskAll: basicInfo.countTasks,
            countTaskNotCompleted: basicInfo.notCompletedTasks,
            countTaskCompleted: basicInfo.completedTasks,
        };
    }
}
