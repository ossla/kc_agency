import express from "express"
import path from "path"

export const uploadStatic = express.static(path.join(__dirname, "..", "..", "uploads"), {
    setHeaders(res, filename) {
        if (path.extname(filename).toLowerCase() === ".mp4") res.setHeader("Content-Type", "video/mp4")
    },
})
