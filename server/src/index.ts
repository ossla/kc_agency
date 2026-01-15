import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import path from "path"
import cors from "cors"
import bodyParser from "body-parser"
import fileUpload from "express-fileupload"

import { appDataSource } from "./data-source"
import router from "./route/router"
import { errorMiddleware } from "./middleware/errorMiddleware"
import "./error/zodErrorsLocalization"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const HOST = "127.0.0.1"

app.use(express.json())
app.use(express.text())
app.use(cookieParser())


app.use(cors({
    origin: process.env.PROD==="1" ? true : "http://localhost:3000",
    credentials: true
}))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(fileUpload())

// файлы
app.use('/uploads', express.static(path.join(__dirname, "..", "uploads")))

// API
app.use("/api", router)
app.use(errorMiddleware)

async function start() {
    if (!process.env.DBPASS) {
        throw new Error("Missing DBPASS in .env")
    }

    await appDataSource.initialize()
    console.log("Data Source initialized")

    app.listen(Number(PORT), HOST, () => {
        console.log(`[server]: ${HOST}:${PORT}`)
    })
}

start()
