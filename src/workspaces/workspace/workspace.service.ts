import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkspaceEntity } from '../entity/workspace.entity';
import { Repository } from 'typeorm'
import { CreateWorkspaceDto } from '../dto/create-workspace-dto';
import { UpdateWorkspaceDto } from '../dto/update-workspace-dto';
import { TaskEntity } from 'src/tasks/entity/task.entity';

@Injectable()
export class WorkspaceService {
    constructor(
        @InjectRepository(WorkspaceEntity)
        private workspacesRepository: Repository<WorkspaceEntity>,
        private tasksRepository: Repository<TaskEntity>
    ){}

    async createWorkspace(createWorkspaceDto: CreateWorkspaceDto): Promise<WorkspaceEntity>{
        return this.workspacesRepository.save(createWorkspaceDto)
    }

    async updateWorkspaceById(id: number, updateWorkspaceDto: UpdateWorkspaceDto): Promise<WorkspaceEntity>{
        const workspace = await this.workspacesRepository.findOne({
            where: {
                id: id
            }
        });
        return this.workspacesRepository.save({
            ...workspace,
            ...updateWorkspaceDto,
        })
    }

    async getWorkspaceById(id: number): Promise<WorkspaceEntity>{
        return await this.workspacesRepository.findOne({
            where: {
                id: id
            }
        })
    }

    async deleteWorkspaceById(id: number): Promise<WorkspaceEntity>{
        const tasks = await this.tasksRepository.find({
            where: {
                workspaceId: id
            }
        })
        
        for(const task of tasks){
            task.softRemove()
        }

        const workspace = await this.workspacesRepository.findOne({
            where: {
                id: id
            },
        })
        return await this.workspacesRepository.softRemove(workspace)
    }

    async getCountTasks(id: number): Promise<number>{
        const tasks = await this.tasksRepository.find({
            where: {
                workspaceId: id
            }
        })
        return await tasks.length
    }

    async getCountCompleteTasks(id: number): Promise<number>{
        const tasks = await this.tasksRepository.find({
            where: {
                workspaceId: id, 
                completed: true
            }
        })
        return await tasks.length
    }

    async getCountNotCompleteTasks(id: number): Promise<number>{
        const tasks = await this.tasksRepository.find({
            where: {
                workspaceId: id, 
                completed: false
            }
        })
        return await tasks.length
    }
}
