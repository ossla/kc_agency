import { CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Actor } from "./actor.entity"
import { User } from "./user.entity"


@Entity()
export class Favorite {
    @PrimaryGeneratedColumn()
    id!: number

    @ManyToOne(() => User, (user) => user.favorites, { onDelete: "CASCADE" })
    @JoinColumn({ name: "userId" })
    user!: User

    @ManyToOne(() => Actor, { onDelete: "CASCADE" })
    @JoinColumn({ name: "actorId" })
    actor!: Actor

    @CreateDateColumn()
    createdAt!: Date
}
