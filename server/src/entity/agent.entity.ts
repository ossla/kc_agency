import { Actor } from "./actor.entity";
import { 
    Entity,
    PrimaryGeneratedColumn,
    Column, 
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";

@Entity()
export class Agent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 40, default: "" })
    first_name: string;       // имя

    @Column({ type: "varchar", length: 40, default: "" })
    last_name: string;        // фамилия

    @Column({ type: "varchar", length: 40, default: "" })
    middle_name: string;      // отчество

    @Column({ type: "varchar", length: 100, default: "" })
    email: string;           // email

    @Column({ type: "varchar", length: 255, default: "" })
    hash_password: string;    // пароль (шифр)

    @Column({ type: "varchar", length: 20, default: "" })
    phone: string;           // телефон

    @Column({ type: "varchar", length: 255, default: "" })
    description: string;     // *описание (на утверждении)

    @Column({ type: "varchar", length: 255, default: "" })
    photoName: string;       // путь к фото на сервере

    @Column({ type: "varchar", length: 100, default: "" })
    telegram: string;        // ссылка на телегу

    @Column({ type: "varchar", length: 100, default: "" })
    VK: string;              // ссылка на VK

    @Column({ type: "varchar", length: 100, default: "" })
    creator: string;

    @OneToMany(() => Actor, (actor) => actor.agent)
    actors: Actor[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
