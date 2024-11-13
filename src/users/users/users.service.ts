import {
    ForbiddenException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entity/user.entity';
import { In, MoreThan, Repository, UpdateResult } from 'typeorm';
import { UserCreateRequestDto } from '../dto/user-create-request.dto';
import { UserUpdateRequestDto } from '../dto/user-update-request.dto';
import { TaskEntity } from 'src/tasks/entity/tasks.entity';
import { WorkspaceEntity } from 'src/workspaces/entity/workspace.entity';
import { SummaryInfo } from 'src/types/summary';
import { isAdmin } from 'src/auth/roles/helpers/helperIsAdmin';

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

    async createUser(
        userCreateRequestDto: UserCreateRequestDto,
    ): Promise<UserEntity> {
        return this.usersRepository.save(userCreateRequestDto);
    }

    async getUserById(user: UserEntity, id: number): Promise<UserEntity> {
        const isAdminStatus = await isAdmin(user);

        if (isAdminStatus) {
            return this.usersRepository.findOne({
                where: {
                    id,
                },
                relations: ['roles'],
            });
        }

        if (user.id !== id) {
            throw new ForbiddenException('No access!');
        }

        return this.usersRepository.findOne({
            where: {
                id,
            },
            relations: ['roles'],
        });
    }

    async deleteUserById(user: UserEntity, id: number): Promise<UserEntity> {
        const isAdminStatus = await isAdmin(user);

        if (!isAdminStatus) {
            throw new ForbiddenException('No access!');
        }

        const findUser = await this.usersRepository.findOne({
            where: {
                id: id,
            },
        });

        if (!findUser) {
            throw new NotFoundException('User not find!');
        }

        return this.usersRepository.softRemove(findUser);
    }

    async updateUserById(
        user: UserEntity,
        id: number,
        userUpdateRequestDto: UserUpdateRequestDto,
    ): Promise<UpdateResult> {
        const isAdminStatus = await isAdmin(user);

        if (isAdminStatus) {
            return this.usersRepository.update(id, userUpdateRequestDto);
        }

        if (user.id !== id) {
            throw new ForbiddenException('Not access!');
        }

        return this.usersRepository.update(id, userUpdateRequestDto);
    }

    async getUserByIdSummary(
        user: UserEntity,
        id: number,
    ): Promise<SummaryInfo> {
        const isAdminStatus = await isAdmin(user);

        if (!isAdminStatus) {
            throw new ForbiddenException('Not access!');
        }

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

        const [countTask, countTaskCompleted, countTaskNotCompleted] =
            await Promise.all([
                this.tasksRepository.count({
                    where: {
                        workspaceId: In(workspacesUserId),
                    },
                }),
                this.tasksRepository.count({
                    where: {
                        workspaceId: In(workspacesUserId),
                        completed: true,
                    },
                }),
                this.tasksRepository.count({
                    where: {
                        workspaceId: In(workspacesUserId),
                        completed: false,
                    },
                }),
            ]);

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
