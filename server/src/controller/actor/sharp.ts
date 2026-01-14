import sharp from "sharp"
import path from "path"
import fs from "fs/promises"


const JPEG_OPTIONS = {
    quality: 85,
    mozjpeg: true
}

export async function resizeAndSave(
        photo: Buffer,
        outDir: string,
        name: string
    ) {
    const image = sharp(photo).rotate()
    console.log("[resizeAndSave] start...")
  

    await Promise.all([
        image
            .clone()
            .resize(400, null, {
                fit: 'inside',
                kernel: sharp.kernel.lanczos3
            })
            .jpeg(JPEG_OPTIONS)
            .toFile(path.join(outDir, `${name}_400.jpg`)),
        image
            .clone()
            .resize(1600, null, {
                fit: 'inside',
                kernel: sharp.kernel.lanczos3
            })
            .jpeg(JPEG_OPTIONS)
            .toFile(path.join(outDir, `${name}_1600.jpg`))
    ])

    console.log("[resizeAndSave] end. Saved 400 and 1600 photo width with name: " + name)
}
