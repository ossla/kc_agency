import express, { Request, Response } from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"
import cors from "cors"
import bodyParser from "body-parser"
import fileUpload from "express-fileupload"

import { appDataSource } from "./data-source"
import { processDefaultError } from "./error/processError"
import router from "./route/router"


/* Configuration */
const app = express()
dotenv.config()
const PORT = process.env.PORT || 3000

/* Using */
app.use(express.json())
app.use(express.text())
app.use(cookieParser())

// Когда фронт и бэк на разных портах, браузер требует, чтобы бэкенд отправлял заголовки CORS.
app.use(cors({
    origin: "http://localhost:3000", // фронт
    credentials: true
}))
app.use(bodyParser.urlencoded({extended: false})) // Для парсинга application/xwww-form-urlencoded|multipart/form-data:
app.use(fileUpload())        // парсинг файлов
app.use(express.static(path.join(__dirname, "..", "static"))) // папка для хранения данных
app.use("/api", router)


async function start() {
    try {
        if (!process.env.DBPASS) {
            throw new Error("Missing DBPASS in .env")
        }

        await appDataSource
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
