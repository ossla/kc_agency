import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Actor } from "./actor.entity";


@Entity()
export class Language {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Actor, actor => actor.languages)
  actors: Actor[];
}