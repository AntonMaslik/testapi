import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../entity/task.entity/task.entity';
import { Repository } from 'typeorm'
import { TaskCreateRequestDto } from '../dto/task-create-request.dto/task-create-request.dto';
import { TaskUpdateRequestDto } from '../dto/task-update-request.dto/task-update-request.dto';

@Injectable()
export class TaskService {
    constructor(@InjectRepository(TaskEntity) private readonly taskRepository: Repository<TaskEntity>) {};

    async createTask(task: TaskCreateRequestDto): Promise<void> {
        let newTask = new TaskEntity();
        newTask.name = task.name;
        newTask.description = task.description;
        newTask.workspace_id = task.workspace_id;
        newTask.completed = false;
        newTask = await this.taskRepository.save(newTask)
    }

    async getAllTasks(): Promise<TaskEntity[]>{
        return await this.taskRepository.find();
    }

    async getTaskById(id: number): Promise<TaskEntity>{
        return await this.taskRepository.findOne({where: {id: id}})
    }

    async updateTask(task: TaskUpdateRequestDto): Promise<void>{
        let taskEntity = await this.taskRepository.findOne({where: {id: task.id}})
        taskEntity.name = task.name==null?taskEntity.name:task.name;
        taskEntity.description = task.description==null?taskEntity.description:task.description;
        taskEntity.workspace_id = task.workspace_id==null?taskEntity.workspace_id:task.workspace_id;
        taskEntity.completed = task.completed==null?taskEntity.completed:task.completed;
    }

    async deleteTask(id: number): Promise<void>{
        const task = await this.taskRepository.findOne({where: {id: id}});
        await this.taskRepository.remove(task);
    }
}
