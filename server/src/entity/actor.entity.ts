import { Agent } from "./agent.entity";
import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm";

@Entity()
export class Actor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 40, default: "" })
    first_name: string;           // имя

    @Column({ type: "varchar", length: 40, default: "" })
    last_name: string;            // фамилия

    @Column({ type: "varchar", length: 40, default: "" })
    middle_name: string;          // отчество

    @Column({ type: "date" })
    date_of_birth: string;       // дата рождения

    @Column({ type: "int", default: 0 })
    height: number;              // рост в см

    @Column({ type: "varchar", length: 30, default: 0 })
    clothes_size: string;         // размер одежды

    @Column({ type: "varchar", length: 30, default: "" })
    eye_color: string;           // цвет глаз

    @Column({ type: "varchar", length: 100, default: "" })
    city: string;                // город

    @Column({ type: "varchar", length: 255, default: "" })
    languages: string;           // иностранные языки

    @Column({ type: "text", default: "" })
    description: string;         // описание

    @Column({ type: "varchar", length: 255, default: "" })
    path_to_folder: string;        // путь к папке с фото, видео

    @Column({ type: "varchar", length: 255, default: "" })
    link_to_kino_teatr: string;     // www.kino-teatr.ru

    @Column({ type: "varchar", length: 255, default: "" })
    link_to_film_tools: string;     // filmtools

    @Column({ type: "varchar", length: 255, default: "" })
    link_to_kinopoisk: string;     // кинопоиск

    @ManyToOne(() => Agent, agent => agent.actors, { 
        onDelete: "SET NULL",
        nullable: true
    })
    @JoinColumn({ name: "agentId" })
    agent: Agent;
}