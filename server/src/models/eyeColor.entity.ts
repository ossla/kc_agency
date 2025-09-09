import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Actor } from "./actor.entity"


@Entity()
export class EyeColor {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string
    
    @OneToMany(() => Actor, (actor) => actor.city)
    actors: Actor[]
}