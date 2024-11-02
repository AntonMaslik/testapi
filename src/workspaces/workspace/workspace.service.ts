import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from 'src/tasks/entity/task.entity';
import { Repository } from 'typeorm';
import { CreateWorkspaceDto } from '../dto/create-workspace-dto';
import { UpdateWorkspaceDto } from '../dto/update-workspace-dto';
import { WorkspaceEntity } from '../entity/workspace.entity';

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectRepository(WorkspaceEntity)
        private workspacesRepository: Repository<WorkspaceEntity>,
        @InjectRepository(TaskEntity)
        private tasksRepository: Repository<TaskEntity>,
    ) {}

    async createWorkspace(
        createWorkspaceDto: CreateWorkspaceDto,
    ): Promise<WorkspaceEntity> {
        return this.workspacesRepository.save(createWorkspaceDto);
    }

    async updateWorkspaceById(
        id: number,
        updateWorkspaceDto: UpdateWorkspaceDto,
    ): Promise<WorkspaceEntity> {
        const workspace = await this.workspacesRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!workspace) {
            throw new NotFoundException('Workspace not found!');
        }

        return this.workspacesRepository.save({
            ...workspace,
            ...updateWorkspaceDto,
        });
    }

    async getWorkspaceById(id: number): Promise<WorkspaceEntity> {
        return this.workspacesRepository.findOne({
            where: {
                id,
            },
        });
    }

    async deleteWorkspaceById(id: number): Promise<WorkspaceEntity> {
        const tasks = await this.tasksRepository.find({
            where: {
                workspaceId: id,
            },
        });

        const workspace = await this.workspacesRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!tasks || !workspace) {
            throw new NotFoundException('Workspace or Tasks not found!');
        }

        await this.tasksRepository.softRemove(tasks);

        return this.workspacesRepository.softRemove(workspace);
    }

    async getTasksByWorkspaceId(id: number) {
        return this.tasksRepository.find({
            where: {
                workspaceId: id,
            },
        });
    }

    async getAllTasks(id: number): Promise<any> {
        return this.tasksRepository
            .createQueryBuilder('tasks')
            .select([
                'COUNT(CASE WHEN tasks.completed = true THEN 1 END) AS completedCount',
                'COUNT(CASE WHEN tasks.completed = false THEN 1 END) AS notCompletedCount',
                'COUNT(tasks.id) AS countTasks',
            ])
            .where('tasks.workspaceId = :id', { id: id })
            .getRawOne();
    }
}
