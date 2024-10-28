import { PrimaryGeneratedColumn, Column, Entity, BaseEntity, DeleteDateColumn } from "typeorm";

export class CommonEntity extends BaseEntity {
    @DeleteDateColumn()
    deletedAt: Date
}