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
    id: string;

    @Column({ type: "varchar", length: 40, nullable: false})
    first_name: string;           // имя

    @Column({ type: "varchar", length: 40, nullable: false})
    last_name: string;            // фамилия

    @Column({ type: "varchar", length: 40, nullable: true })
    middle_name?: string;          // отчество

    @Column({ type: "date", nullable: false })
    date_of_birth: Date;       // дата рождения

    @Column({ type: "int", default: 0, nullable: true })
    height?: number;              // рост в см

    @Column({ type: "varchar", length: 30, nullable: true })
    clothes_size?: number;         // размер одежды

    @Column({ type: "text", nullable: true })
    description?: string;         // описание

    @Column({ type: "varchar", length: 255, nullable: false })
    directory: string;               // путь к папке с файлами

    @Column({ type: "varchar", length: 255, nullable: true })
    link_to_kino_teatr?: string;     // kino-teatr.ru

    @Column({ type: "varchar", length: 255, nullable: true })
    link_to_film_tools?: string;     // filmtools

    @Column({ type: "varchar", length: 255, nullable: true })
    link_to_kinopoisk?: string;     // кинопоиск

    @Column({type: "text", default: "", nullable: true })
    video?: string;                  // видеовизитка (код вставки?) 

    @ManyToOne(() => Agent, agent => agent.actors, { 
        onDelete: "SET NULL",
        nullable: true
    })
    @JoinColumn({ name: "agent_id" })
    agent: Agent                   // к какому агенту относятся

    @ManyToOne(() => EyeColor, { eager: true, nullable: true })
    @JoinColumn({ name: "eye_color_id" })
    eye_color?: EyeColor             // цвет глаз

    @ManyToOne(() => City, { eager: true, nullable: true })
    @JoinColumn({ name: "city_id" })
    city?: City                     // город проживания

    @ManyToMany(() => Language, { eager: true, nullable: true })
    @JoinTable()
    languages?: Language[]          // доп. языки

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}       