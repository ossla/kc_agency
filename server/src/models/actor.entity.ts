import { Employee } from "./employee.entity"
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm"
import { EyeColor } from "./eyeColor.entity"
import { City } from "./city.entity"
import { Language } from "./language.entity"

@Entity()
export class Actor {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "varchar", length: 40, nullable: false })
    firstName!: string           // имя

    @Column({ type: "varchar", length: 40, nullable: false })
    lastName!: string            // фамилия

    @Column({ type: "varchar", length: 40, nullable: true })
    middleName?: string         // отчество

    @Column({ type: "character" })
    gender!: string

    @Column({ type: "date", nullable: false })
    dateOfBirth!: Date           // дата рождения

    @Column({ type: "int", default: 0, nullable: true })
    height?: number             // рост в см

    @Column({ type: "int", default: 0, nullable: true })
    clothesSize?: number        // размер одежды

    @Column({ type: "text", nullable: true })
    description?: string        // описание

    @Column({ type: "varchar", length: 255, nullable: false })
    directory!: string           // путь к папке с файлами

    @Column({ type: "varchar", length: 255, nullable: true })
    linkToKinoTeatr?: string    // kino-teatr.ru

    @Column({ type: "varchar", length: 255, nullable: true })
    linkToFilmTools?: string    // filmtools

    @Column({ type: "varchar", length: 255, nullable: true })
    linkToKinopoisk?: string    // кинопоиск

    @Column({ type: "text", default: "", nullable: true })
    videoCode?: string          // видеовизитка (код вставки?) 

    @Column("text", { array: true, default: () => "ARRAY[]::text[]" })
    photos!: string[]            // фото помимо аватарки

    @ManyToOne(() => Employee, employee => employee.actors, {
        onDelete: "SET NULL",
        eager: true,
        nullable: false
    })
    @JoinColumn({ name: "employee_id" })
    employee!: Employee                // к какому агенту относятся

    @ManyToOne(() => EyeColor, { eager: true, nullable: true })
    @JoinColumn({ name: "eye_color_id" })
    eyeColor?: EyeColor         // цвет глаз

    @ManyToOne(() => City, { eager: true, nullable: true })
    @JoinColumn({ name: "city_id" })
    city?: City                 // город проживания

    @ManyToMany(() => Language, { eager: true, nullable: true })
    @JoinTable()
    languages?: Array<Language> // доп. языки

    @CreateDateColumn()
    createdAt!: Date

    @UpdateDateColumn()
    updatedAt!: Date
}
