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

    async createWorkspaceForAdmin() {}

    async updateWorkspaceForAdmin() {}

    async deleteWorkspaceForAdmin() {}

    async getWorkspaceByIdForAdmin() {}

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

    async getTasksByWorkspaceIdForUser(userId: number, workspaceId: number) {
        const workspace = await this.workspacesRepository.findOne({
            where: {
                userId: userId,
                id: workspaceId,
            },
        });

        return this.tasksRepository.find({
            where: {
                workspaceId: workspace.id,
            },
        });
    }

    async getTasksBasicInfoByWorkspaceIdForUser(
        userId: number,
        workspaceId: number,
    ) {
        const basicInfo = this.tasksRepository
            .createQueryBuilder('tasks')
            .select([
                'SELECT COUNT(CASE WHEN tasks.completed = true THEN 1 END)',
                'SELECT COUNT(CASE WHEN tasks.completed = false THEN 1 END)',
                'SELECT COUNT(tasks.id)',
            ])
            .where('tasks.workspace = :workspaceId', {
                workspaceId: workspaceId,
            })
            .andWhere('workspaces.userId = :userId', {
                userId: userId,
            })
            .getMany();
    }
}
