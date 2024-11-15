import {
    BaseEntity,
    CreateDateColumn,
    DeleteDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { classToPlain } from 'class-transformer';

export class CommonEntity extends BaseEntity {
    @DeleteDateColumn()
    deletedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    toJSON() {
        return classToPlain(this);
    }
}
