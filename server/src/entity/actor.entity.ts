import { Agent } from "./agent.entity"
import { 
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from "typeorm"

@Entity()
export class Actor {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string           // имя

    @Column()
    lastName: string            // фамилия

    @Column()
    middleName: string          // отчество

    @Column({ type: 'date' })
    date_of_birth: string;      // дата рождения
    
    @Column()
    height: number              // рост (в см)
    
    @Column()
    clothesSize: number         // размер одежды

    @Column()
    eye_color: string           // цвет глаз

    @Column()
    city: string                // город

    @Column()
    languages: string           // иностранные языки

    @Column("text")
    description: string         // *описание (на утверждении)

    @Column()
    pathToFolder: string        // путь к папке с фото, видео на сервере

    @Column()
    linkToKinoTeatr: string     // ссылка на www.kino-teatr.ru

    @Column()
    linkToKinopoisk: string     // *ссылка на кинопоиск (на утверждении)

    @Column()
    linkToIMDb: string          // *ссылка на IMDb (на утверждении)

    @ManyToOne(() => Agent, agent => agent.actors, { 
        onDelete: "SET NULL",
        nullable: true
    })
    @JoinColumn({ name: "agentId" })
    agent: Agent
}