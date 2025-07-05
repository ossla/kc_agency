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

    @Column({ type: "text", default: "" })
    description: string;         // описание

    @Column({ type: "varchar", length: 255, default: "" })
    folder: string;               // путь к папке с файлами

    @Column({ type: "varchar", length: 255, default: "" })
    link_to_kino_teatr: string;     // www.kino-teatr.ru

    @Column({ type: "varchar", length: 255, default: "" })
    link_to_film_tools: string;     // filmtools

    @Column({ type: "varchar", length: 255, default: "" })
    link_to_kinopoisk: string;     // кинопоиск

    @Column({type: "text", default: "" })
    video: string;                  // видеовизитка (код вставки?) 

    @Column({type: "varchar", length: 40})
    creator: string                // кто создавал запись

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