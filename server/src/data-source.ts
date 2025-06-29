import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv"

import { Agent } from "./entity/agent.entity"
import { Actor } from "./entity/actor.entity"


dotenv.config()

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DBHOST,
    port: process.env.DBPORT ? parseInt(process.env.DBPORT) : 5432,
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    synchronize: true,
    logging: false,
    entities: [Agent, Actor],
    migrations: [],
    subscribers: [],
})