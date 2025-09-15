import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from "typeorm"
import { User } from "./user.entity"


@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn("uuid")
    id!: string

    @ManyToOne(() => User, { onDelete: "CASCADE" })
    user!: User

    @Column()
    tokenHash!: string

    @Column({ type: "timestamptz" })
    expiresAt!: Date

    @CreateDateColumn()
    createdAt!: Date
}