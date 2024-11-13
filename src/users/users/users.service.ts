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

        const findUser = await this.usersRepository
            .createQueryBuilder('users')
            .where('users.id = :id', { id })
            .getOne();

        const workspacesUser = await this.workspacesRepository
            .createQueryBuilder('workspaces')
            .where('workspaces.userId = :id', { id })
            .getMany();

        const tasksUser = await this.tasksRepository
            .createQueryBuilder('tasks')
            .where('tasks.workspaceId IN (:...workspacesUserIds)', {
                workspacesUserIds: workspacesUser.map(
                    (workspaces) => workspaces.id,
                ),
            })
            .getMany();

        if (!findUser) {
            throw new NotFoundException('User not find!');
        }

        if (workspacesUser.length) {
            await Promise.all([
                this.tasksRepository.softRemove(tasksUser),
                this.workspacesRepository.softRemove(workspacesUser),
            ]);
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

        const { countTask, countTaskCompleted, countTaskNotCompleted } =
            await this.tasksRepository
                .createQueryBuilder('task')
                .select([
                    'COUNT(task.id) AS "countTask"',
                    'SUM(CASE WHEN task.completed = true THEN 1 ELSE 0 END) AS "countTaskCompleted"',
                    'SUM(CASE WHEN task.completed = false THEN 1 ELSE 0 END) AS "countTaskNotCompleted"',
                ])
                .where('task.workspaceId IN (:...workspacesUserId)', {
                    workspacesUserId,
                })
                .getRawOne();

        const [tasksLast30Days, tasksLast7Days, tasksLast24Hours] =
            await this.tasksRepository
                .createQueryBuilder('tasks')
                .select([
                    '(CASE WHEN tasks.createdAt > :last30Days THEN 1 ELSE 0 END) AS "tasksLast30Days"',
                    '(CASE WHEN tasks.createdAt > :last7Days THEN 1 ELSE 0 END) AS "tasksLast7Days"',
                    '(CASE WHEN tasks.createdAt > :last24Hours THEN 1 ELSE 0 END) AS "tasksLast24Hours"',
                ])
                .where('tasks.workspaceId IN (:...workspacesUserId)', {
                    workspacesUserId,
                })
                .setParameters({
                    last30Days,
                    last7Days,
                    last24Hours,
                })
                .getRawMany();

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
