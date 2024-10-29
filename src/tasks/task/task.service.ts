import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../entity/task.entity';
import { Repository } from 'typeorm'
import { TaskCreateRequestDto } from '../dto/task-create-request.dto';
import { TaskUpdateRequestDto } from '../dto/task-update-request.dto';

@Injectable()
export class TaskService {
    constructor(@InjectRepository(TaskEntity) private readonly taskRepository: Repository<TaskEntity>) {};

    async createTask(task: TaskCreateRequestDto): Promise<TaskEntity> {
        const newTask = new TaskEntity();

        newTask.name = task.name;
        newTask.description = task.description;
        newTask.workspaceId = task.workspace_id;
        newTask.completed = false;
        
        return this.taskRepository.save(newTask);
    }

    async getAllTasks(): Promise<TaskEntity[]>{
        return this.taskRepository.find();
    }

    async getTaskById(id: number): Promise<TaskEntity>{
        return this.taskRepository.findOne({where: {id: id}})
    }

    async updateTask(task: TaskUpdateRequestDto): Promise<TaskEntity>{
        let taskEntity = await this.taskRepository.findOne({where: {id: task.id}})
        
        taskEntity.name = task.name==null?taskEntity.name:task.name;
        taskEntity.description = task.description==null?taskEntity.description:task.description;
        taskEntity.workspaceId = task.workspace_id==null?taskEntity.workspaceId:task.workspace_id;
        taskEntity.completed = task.completed==null?taskEntity.completed:task.completed;

        return taskEntity;
    }

    async deleteTask(id: number): Promise<boolean>{
        const task = await this.taskRepository.findOne({where: {id: id}});
        
        await this.taskRepository.remove(task);
        
        return true;
    }
}
