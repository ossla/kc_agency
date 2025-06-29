import express, { Request, Response } from "express"
import dotenv from "dotenv"

import { AppDataSource } from "./data-source"
import { processDefaultError } from "./error/processError"
import router from "./route/router"
import path from "path"

/* Configuration */
const app = express()
dotenv.config()
const PORT = process.env.PORT || 3000

/* Using */
app.use(express.json())
app.use(express.text())
app.use("/api", router)
app.use(express.static(path.join(__dirname, "..", "public")))

async function start() {
    try {
        if (!process.env.DBPASS) {
            throw new Error("Missing DBPASS in .env")
        }

        await AppDataSource
            .initialize()
            .then(() => {
                console.log("Data Source has been initialized!")
            })

        app.listen(PORT, () => {
            console.log(`[server]: Server is running at http://localhost:${PORT}`);
        });

    } catch (error: unknown) {
        processDefaultError(error)
    }
}

start()
