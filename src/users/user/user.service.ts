import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { createQueryBuilder, In, MoreThan, Repository } from 'typeorm';
import { UserCreateRequestDto } from '../dto/user-create-request.dto';
import { UserUpdateRequestDto } from '../dto/user-update-request.dto';
import { TaskEntity } from 'src/tasks/entity/task.entity';
import { WorkspaceEntity } from 'src/workspaces/entity/workspace.entity';
import { SummaryInfo } from 'src/types/summary';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        @InjectRepository(TaskEntity)
        private tasksRepository: Repository<TaskEntity>,
        @InjectRepository(WorkspaceEntity)
        private workspacesRepository: Repository<WorkspaceEntity>,
    ) {}

    async getAllUsers() {
        return this.usersRepository.find();
    }

    async getUserById(id: number) {
        const user = await this.usersRepository.findOne({
            where: {
                id: id,
            },
            relations: ['roles'],
        });
        if (user) {
            return user;
        }
        throw new NotFoundException('Could not find the user');
    }

    async getUserByEmail(email: string) {
        const user = await this.usersRepository.findOne({
            where: {
                email: email,
            },
        });
        if (user) {
            return user;
        }
        return null;
    }

    async createUser(createUserDto: UserCreateRequestDto): Promise<UserEntity> {
        return this.usersRepository.save(createUserDto);
    }

    async deleteUserById(id: number): Promise<UserEntity> {
        const user = await this.usersRepository.findOne({
            where: {
                id: id,
            },
        });
        if (!user) {
            return null;
        }

        await this.usersRepository.softRemove(user);
        return user;
    }

    async updateUserById(
        id: number,
        userDto: UserUpdateRequestDto,
    ): Promise<UserEntity> {
        let user = await this.usersRepository.findOne({
            where: {
                id: id,
            },
        });
        return this.usersRepository.save({
            ...user,
            ...userDto,
        });
    }

    async getSummaryByUserId(id: number): Promise<SummaryInfo> {
        const now = new Date();
        const last30Days = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const workspacesUser = await this.workspacesRepository
            .createQueryBuilder('workspaces')
            .where('workspaces.userId = :userId', { userId: id })
            .getMany();

        const workspacesUserId = workspacesUser.map(
            (workspace) => workspace.id,
        );
        const countTask = await this.tasksRepository.count({
            where: {
                workspaceId: In(workspacesUserId),
            },
        });
        const countTaskCompleted = await this.tasksRepository.count({
            where: {
                workspaceId: In(workspacesUserId),
                completed: true,
            },
        });
        const countTaskNotCompleted = await this.tasksRepository.count({
            where: {
                workspaceId: In(workspacesUserId),
                completed: false,
            },
        });

        const [tasksLast30Days, tasksLast7Days, tasksLast24Hours] =
            await Promise.all([
                this.tasksRepository.count({
                    where: {
                        workspaceId: In(workspacesUserId),
                        createdAt: MoreThan(last30Days),
                    },
                }),
                this.tasksRepository.count({
                    where: {
                        workspaceId: In(workspacesUserId),
                        createdAt: MoreThan(last7Days),
                    },
                }),
                this.tasksRepository.count({
                    where: {
                        workspaceId: In(workspacesUserId),
                        createdAt: MoreThan(last24Hours),
                    },
                }),
            ]);

        return {
            countTaskAll: countTask,
            countTaskCompleted: countTaskCompleted,
            countTaskNotCompleted: countTaskNotCompleted,
            countTaskLast24Hours: tasksLast24Hours,
            countTaskLast7Days: tasksLast7Days,
            countTaskLast30Days: tasksLast30Days,
            workspaces: workspacesUser,
        };
    }
}
