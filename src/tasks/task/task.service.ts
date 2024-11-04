import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../entity/task.entity';
import { Repository, UpdateResult } from 'typeorm';
import { TaskCreateRequestDto } from '../dto/task-create-request.dto';
import { TaskUpdateRequestDto } from '../dto/task-update-request.dto';

@Injectable()
export class TaskService {
    constructor(
        @InjectRepository(TaskEntity)
        private readonly taskRepository: Repository<TaskEntity>,
    ) {}

    async createTask(task: TaskCreateRequestDto): Promise<TaskEntity> {
        return this.taskRepository.save(task);
    }

    async getAllTasks(): Promise<TaskEntity[]> {
        return this.taskRepository.find();
    }

    async getTaskById(id: number): Promise<TaskEntity> {
        return this.taskRepository.findOne({ where: { id } });
    }

    async updateTask(
        id: number,
        taskUpdateRequestDto: TaskUpdateRequestDto,
    ): Promise<UpdateResult> {
        return this.taskRepository.update({ id: id }, taskUpdateRequestDto);
    }

    async updatePosition(
        id: number,
        position: number,
    ): Promise<UpdateResult | NotFoundException> {
        const task = await this.getTaskById(id);

        if (!task) {
            return new NotFoundException('Workspace or Tasks not found!');
        }

        return this.taskRepository.update(task.id, { position });
    }

    async deleteTask(id: number): Promise<boolean> {
        const task = await this.taskRepository.findOne({ where: { id: id } });

        await this.taskRepository.remove(task);

        return true;
    }
}
