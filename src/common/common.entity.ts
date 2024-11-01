import {
    PrimaryGeneratedColumn,
    Column,
    Entity,
    BaseEntity,
    DeleteDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export class CommonEntity extends BaseEntity {
    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
