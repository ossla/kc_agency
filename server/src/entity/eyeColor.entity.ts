import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity()
export class EyeColor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    name: string;
}