import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv"

import { Agent } from "./entity/agent.entity"
import { Actor } from "./entity/actor.entity"
import { processDefaultError } from "./error/processError"
import { EyeColor } from "./entity/eyeColor.entity"
import { City } from "./entity/city.entity"
import { Language } from "./entity/language.entity"


dotenv.config()

if (typeof process.env.DBHOST === "undefined" || typeof process.env.DBNAME === "undefined" || typeof process.env.DBUSER === "undefined" || typeof process.env.DBPASS == "undefined") {
    console.error("\n.env UNDEFINED\n");
}

export const appDataSource = new DataSource({
    type: "postgres",
    host: process.env.DBHOST,
    port: process.env.DBPORT ? parseInt(process.env.DBPORT) : 5432,
    username: process.env.DBUSER,
    password: process.env.DBPASS,
    database: process.env.DBNAME,
    synchronize: true,
    logging: false,
    entities: [Agent, Actor, EyeColor, City, Language],
    migrations: [],
    subscribers: [],
})