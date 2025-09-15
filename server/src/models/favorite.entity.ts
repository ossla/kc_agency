import { CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Actor } from "./actor.entity"
import { User } from "./user.entity"


@Entity()
export class Favorite {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User, (user) => user.favorites, { onDelete: "CASCADE" })
    user!: User

    @ManyToOne(() => Actor, { onDelete: "CASCADE" })
    actor!: Actor

    @CreateDateColumn()
    createdAt!: Date
}
