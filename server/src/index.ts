import express, { Request, Response } from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"
import cors from "cors"
import bodyParser from "body-parser"
import fileUpload from "express-fileupload"

import { appDataSource } from "./data-source"
import router from "./route/router"
import { errorMiddleware } from "./middleware/errorMiddleware"

dotenv.config()
const app = express()
const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(express.text())
app.use(cookieParser())

app.use(cors({
    origin: "http://localhost:3000", // фронт
    credentials: true
}))

// Для парсинга форм и файлов
app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload())

// Папка для хранения данных
app.use(express.static(path.join(__dirname, "..", "static")))

// API
app.use("/api", router)
app.use(errorMiddleware)

console.log("Routes loaded")

/* production */
// app.use(express.static(path.join(__dirname, "..", "..", "client", "build")))
// app.use((req: Request, res: Response) => {
//     res.sendFile(path.join(__dirname, "..", "..", "client", "build", "index.html"))
// })

async function start() {
    if (!process.env.DBPASS) {
        throw new Error("Missing DBPASS in .env")
    }

    await appDataSource.initialize()
        .then(() => {
            console.log("Data Source has been initialized!")
        })

    app.listen(PORT, () => {
        console.log(`[server]: Server is running at http://localhost:${PORT}`)
    })
}

start()
