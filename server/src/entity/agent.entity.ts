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
    id: number

    @Column()
    firstName: string       // имя

    @Column()
    lastName: string        // фамилия

    @Column()
    middleName: string      // отчество
    
    @Column()
    email: string           // email
    
    @Column()
    hashPassword: string        // пароль (шифр)
    
    @Column()
    phone: string           // телефон

    @Column()
    description: string     // *описание (на утверждении)

    @Column()
    photoName: string      // путь к фото на сервере

    @Column()
    telegram: string        // ссылка на телегу

    @Column()
    VK: string              // ссылка на телегу
    
    @Column()
    creator: string

    @OneToMany(() => Actor, (actor) => actor.agent)
    actors: Actor[]

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
