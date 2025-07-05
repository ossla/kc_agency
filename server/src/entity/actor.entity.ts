import { Agent } from "./agent.entity";
import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm";
import { EyeColor } from "./eyeColor.entity";
import { City } from "./city.entity";
import { Language } from "./language.entity";


@Entity()
export class Actor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: "varchar", length: 40})
    first_name: string;           // имя

    @Column({ type: "varchar", length: 40})
    last_name: string;            // фамилия

    @Column({ type: "varchar", length: 40, nullable: true })
    middle_name?: string;          // *отчество

    @Column({ type: "date" })
    date_of_birth: string;       // дата рождения

    @Column({ type: "int", default: 0, nullable: true })
    height?: number;              // *рост в см

    @Column({ type: "varchar", length: 30, nullable: true })
    clothes_size?: string;         // *размер одежды

    @Column({ type: "text", nullable: true })
    description?: string;         // *описание

    @Column({ type: "varchar", length: 255 })
    directory: string;               // путь к папке с файлами

    @Column({ type: "varchar", length: 255, nullable: true })
    link_to_kino_teatr?: string;     // *kino-teatr.ru

    @Column({ type: "varchar", length: 255, nullable: true })
    link_to_film_tools?: string;     // *filmtools

    @Column({ type: "varchar", length: 255, nullable: true })
    link_to_kinopoisk?: string;     // *кинопоиск

    @Column({type: "text", default: "", nullable: true })
    video?: string;                  // видеовизитка (код вставки?) 

    @ManyToOne(() => Agent, agent => agent.actors, { 
        onDelete: "SET NULL",
        nullable: true
    })
    @JoinColumn({ name: "agentId" })
    agent: Agent                   // к какому агенту относятся

    @ManyToOne(() => EyeColor, { eager: true })
    eye_color: EyeColor             // цвет глаз

    @ManyToOne(() => City, { eager: true })
    city: City                     // город проживания

    @ManyToMany(() => Language, { eager: true })
    @JoinTable()
    languages: Language[]          // доп. языки

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}       