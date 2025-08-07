import express, { Request, Response } from "express"
import dotenv from "dotenv"

import { appDataSource } from "./data-source"
import { processDefaultError } from "./error/processError"
import router from "./route/router"
import path from "path"
import cors from "cors"
import bodyParser from "body-parser"
import fileUpload from "express-fileupload"


/* Configuration */
const app = express()
dotenv.config()
const PORT = process.env.PORT || 3000

/* Using */
app.use(express.json())
app.use(express.text())
app.use(cors())         // обход браузерных блокировок http запросов
// Когда фронт и бэк на разных портах, браузер требует, чтобы бэкенд отправлял заголовки CORS

// Для парсинга application/xwww-form-urlencoded|multipart/form-data:
app.use(bodyParser.urlencoded({extended: false}))
app.use(fileUpload())        // парсинг файлов
app.use(express.static(path.join(__dirname, "..", "static"))) // папка для хранения данных

app.use("/api", router)         // роутинг

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
