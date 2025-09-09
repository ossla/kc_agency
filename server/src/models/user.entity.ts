import { Exclude } from "class-transformer"
import { Actor } from "./actor.entity"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn
} from "typeorm"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "varchar", length: 40, nullable: false })
    name!: string            // имя

    @Column({ type: "varchar", length: 40, nullable: false })
    email!: string           // фамилия

    @Column({ type: "boolean", nullable: false })
    isAdmin!: boolean        // права доступа

    @Column({ type: "varchar", length: 255, nullable: false })
    @Exclude()
    hashPassword!: string    // хэш пароля
}
