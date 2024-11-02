import { BaseEntity, DeleteDateColumn, UpdateDateColumn } from 'typeorm';

export class CommonEntity extends BaseEntity {
    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
