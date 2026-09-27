import { Router } from "express"
import fileUpload from "express-fileupload"
import path from "path"
import os from "os"
import { promises as fs } from "fs"
import { randomUUID } from "crypto"
import { execFile } from "child_process"
import { promisify } from "util"
import { authMiddleware } from "../middleware/authMiddleware"
import { checkMiddleware } from "../middleware/checkMiddleware"
import { appDataSource } from "../data-source"
import { Actor } from "../models/actor.entity"
import { ActorVideo, actorVideos } from "../models/actorVideo"
import ApiError from "../error/apiError"
import { returnStaticPath } from "../controller/services/fileSystemService"

const probe = promisify(execFile)
const maxBytes = Number(process.env.VIDEO_MAX_BYTES || 2 * 1024 ** 3)
if (!Number.isSafeInteger(maxBytes) || maxBytes <= 0) throw new Error("Invalid VIDEO_MAX_BYTES")
const router = Router()
router.use(authMiddleware, checkMiddleware)
router.get("/config", (_req, res) => { res.json({ maxBytes }) })

async function removeLocal(url?: string) {
    if (!url || !/^\/uploads\/[\w-]+\/video-[\w-]+\.mp4$/.test(url)) return
    await fs.unlink(path.join(returnStaticPath(), url.slice("/uploads/".length)))
        .catch(error => { if (error.code !== "ENOENT") console.error("Video cleanup failed", error) })
}

router.post(["/:id", "/:id/:videoId"], fileUpload({
    useTempFiles: true,
    tempFileDir: path.join(os.tmpdir(), "kc-agency-video"),
    limits: { fileSize: maxBytes, files: 1, fields: 0 },
    abortOnLimit: true,
    responseOnLimit: "Video exceeds upload limit",
    uploadTimeout: 120000,
}), async (req, res) => {
    const files = Object.values(req.files || {}).flat()
    let newPath: string | undefined
    try {
        const file = req.files?.video
        if (!file || Array.isArray(file) || files.length !== 1 || file.truncated || !file.size) {
            throw ApiError.badRequest("Upload one MP4 video")
        }
        const { stdout } = await probe(require("ffprobe-static").path, [
            "-v", "error", "-protocol_whitelist", "file", "-show_streams", "-show_format", "-of", "json", file.tempFilePath,
        ], { timeout: 30000, maxBuffer: 1024 * 1024 }).catch(error => {
            console.error("[actor-video] ffprobe failed", error)
            if (typeof error.code === "string" || error.killed || error.signal) {
                throw ApiError.internal("Video validation service is unavailable. Check server logs.")
            }
            throw ApiError.badRequest("Cannot read video. Use MP4 with H.264 and AAC.")
        })
        const metadata = JSON.parse(stdout)
        const streams = metadata.streams || []
        if (!metadata.format?.format_name?.split(",").includes("mp4") ||
            !streams.some((s: any) => s.codec_type === "video" && s.codec_name === "h264") ||
            streams.some((s: any) => s.codec_type === "video" && s.codec_name !== "h264" || s.codec_type === "audio" && s.codec_name !== "aac")) {
            throw ApiError.badRequest("Use MP4 with H.264 video and AAC audio")
        }
        let oldURL: string | undefined
        let videos: ActorVideo[] = []
        let uploadedId = ""
        await appDataSource.transaction(async manager => {
            const actor = await manager.createQueryBuilder(Actor, "actor")
                .setLock("pessimistic_write").where("actor.id = :id", { id: req.params.id }).getOne()
            if (!actor) throw ApiError.badRequest("Actor not found")
            videos = [...actorVideos(actor)]
            const index = req.params.videoId ? videos.findIndex(video => video.id === req.params.videoId) : -1
            if (req.params.videoId && index === -1) throw new ApiError(404, "Video not found")
            if (!/^[\w-]+$/.test(actor.directory)) throw ApiError.badRequest("Invalid actor directory")
            const filename = `video-${randomUUID()}.mp4`
            const directory = path.join(returnStaticPath(), actor.directory)
            await fs.mkdir(directory, { recursive: true })
            newPath = path.join(directory, filename)
            await file.mv(newPath)
            const video = {
                id: index >= 0 ? videos[index].id : randomUUID(),
                url: `/uploads/${actor.directory}/${filename}`,
                name: path.basename(file.name).slice(0, 200),
            }
            uploadedId = video.id
            if (index >= 0) {
                oldURL = videos[index].url
                videos[index] = video
            } else videos.push(video)
            await manager.update(Actor, actor.id, { videos, videoURL: videos[0]?.url || "" })
        })
        newPath = undefined
        await removeLocal(oldURL)
        res.json({ videos, videoURL: videos[0]?.url || "", uploadedId })
    } catch (error) {
        console.error("[actor-video] upload failed", error)
        throw error
    } finally {
        if (newPath) await fs.unlink(newPath).catch(() => {})
        await Promise.all(files.map(file => fs.unlink(file.tempFilePath).catch(() => {})))
    }
})

router.delete("/:id/:videoId", async (req, res) => {
    let oldURL: string | undefined
    let videos: ActorVideo[] = []
    await appDataSource.transaction(async manager => {
        const actor = await manager.createQueryBuilder(Actor, "actor")
            .setLock("pessimistic_write").where("actor.id = :id", { id: req.params.id }).getOne()
        if (!actor) throw ApiError.badRequest("Actor not found")
        videos = [...actorVideos(actor)]
        const index = videos.findIndex(video => video.id === req.params.videoId)
        if (index === -1) throw new ApiError(404, "Video not found")
        oldURL = videos[index].url
        videos.splice(index, 1)
        await manager.update(Actor, actor.id, { videos, videoURL: videos[0]?.url || "" })
    })
    await removeLocal(oldURL)
    res.json({ videos, videoURL: videos[0]?.url || "" })
})

export default router
