import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from "dotenv"

import { Employee } from "./models/employee.entity"
import { Actor } from "./models/actor.entity"
import { EyeColor } from "./models/eyeColor.entity"
import { City } from "./models/city.entity"
import { Language } from "./models/language.entity"
import { User } from "./models/user.entity"
import { RefreshToken } from "./models/refreshToken.entity"
import { Favorite } from "./models/favorite.entity"


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
    entities: [Employee, Actor, User, RefreshToken, EyeColor, City, Language, Favorite],
    migrations: [],
    subscribers: [],
})