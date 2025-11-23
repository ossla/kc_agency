import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"

import { Actor } from "./actor.entity"


@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: "varchar", length: 40, nullable: false })
    firstName: string       // имя

    @Column({ type: "varchar", length: 40, nullable: false })
    lastName: string        // фамилия

    @Column({ type: "varchar", length: 40, nullable: true })
    middleName?: string     // отчество

    @Column({ type: "varchar", length: 100, nullable: false, unique: true })
    email: string           // email

    @Column({ type: "varchar", length: 20, nullable: false })
    phone: string           // телефон

    @Column({ type: "varchar", length: 255, nullable: true })
    description?: string    // описание (на утверждении)

    @Column({ type: "varchar", length: 255, nullable: false })
    photo: string           // путь к фото на сервере

    @Column({ type: "varchar", length: 100, nullable: true })
    telegram?: string       // ссылка на телегу

    @Column({ type: "varchar", length: 100, nullable: true })
    vk?: string             // ссылка на VK

    @OneToMany(() => Actor, (actor) => actor.employee)
    actors: Actor[]         // пул актеров

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
