import { Actor } from "./actor.entity"
import { 
    Entity,
    PrimaryGeneratedColumn,
    Column, 
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"

@Entity()
export class Agent {
    @PrimaryGeneratedColumn()
    id: string

    @Column({ type: "varchar", length: 40, nullable: false })
    first_name: string       // имя

    @Column({ type: "varchar", length: 40, nullable: false })
    last_name: string        // фамилия

    @Column({ type: "varchar", length: 40, nullable: true })
    middle_name?: string      // отчество

    @Column({ type: "varchar", length: 100, nullable: false, unique: true})
    email: string           // email

    @Column({ type: "varchar", length: 255, nullable: false })
    hash_password: string    // пароль (шифр)

    @Column({ type: "varchar", length: 20, nullable: false })
    phone: string           // телефон

    @Column({ type: "varchar", length: 255, nullable: true })
    description?: string     // описание (на утверждении)

    @Column({ type: "varchar", length: 255, nullable: false })
    photo_name: string       // путь к фото на сервере

    @Column({ type: "varchar", length: 100, nullable: true })
    telegram?: string        // ссылка на телегу

    @Column({ type: "varchar", length: 100, nullable: true })
    VK?: string                // ссылка на VK

    @OneToMany(() => Actor, (actor) => actor.agent)
    actors: Actor[]         // пул актеров

    @Column({type: "bool", nullable: false})
    is_admin: boolean       // права доступа

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
