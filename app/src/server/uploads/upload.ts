import { basename, extname } from "path"
import { prisma } from "../database/prisma"
import sharp from "sharp"
import { putObject } from "./r2client"
import { extension as mimeExtension } from "mime-types"

const ALLOWED_IMAGE_TYPES = ["jpg", "jpeg", "png", "webp"]
const ALLOWED_AUDIO_TYPES = ["mp3", "wav", "m4a", "ogg", "flac"]
const ALLOWED_FILE_TYPES = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_AUDIO_TYPES]

const MAX_FILE_SIZE = 50 * 1024 * 1024

export interface UploadFileOptions {
    privateUserId?: string
    compress?: boolean
    normalize?: boolean
    trim?: boolean
    alt?: string
    compressBounds?: {
        width?: number
        height?: number
    }
}

const DEFAULT_UPLOAD_OPTIONS: UploadFileOptions = {
    compress: true,
    normalize: true
}

export async function uploadFile(file: File, options: UploadFileOptions = DEFAULT_UPLOAD_OPTIONS) {
    options = { ...DEFAULT_UPLOAD_OPTIONS, ...options }

    const extension = extname(file.name).slice(1).toLowerCase()

    if (!ALLOWED_FILE_TYPES.includes(extension)) {
        throw new Error("Unsupported file type")
    }
    const buffer = Buffer.from(await file.arrayBuffer())

    if (buffer.length > MAX_FILE_SIZE) {
        throw new Error(`File size ${buffer.length} exceeds maximum of ${MAX_FILE_SIZE}`)
    }

    let processedBuffer: Buffer = buffer
    let processedFilename = file.name
    let processedType = file.type

    const isImage = ALLOWED_IMAGE_TYPES.includes(extension)
    const isAudio = ALLOWED_AUDIO_TYPES.includes(extension)

    if (isImage) {
        if (options.compress || options.normalize || options.trim) {
            let pipeline = sharp(processedBuffer)

            if (options.compress) {
                pipeline = pipeline.resize({
                    width: options.compressBounds?.width || 1080,
                    height: options.compressBounds?.height || 1920,
                    withoutEnlargement: true,
                    fit: "inside"
                })
            }

            if (options.trim) {
                pipeline = pipeline.trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 })
            }

            if (options.normalize) {
                pipeline = pipeline.webp()

                const nameWithoutExt = basename(file.name, extname(file.name))
                processedFilename = `${nameWithoutExt}.webp`
                processedType = "image/webp"
            }

            processedBuffer = await pipeline.toBuffer()
        }
    }

    if (isAudio) {
        if (options.compress) {
            const nameWithoutExt = basename(file.name, extname(file.name))
            processedFilename = `${nameWithoutExt}.opus`
            processedType = "audio/ogg; codecs=opus"
        }
    }

    const timestamp = Date.now()

    const sanitizedName = processedFilename
        .replace(/[^a-zA-Z0-9.-]/g, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "")

    const ext = extname(sanitizedName)
    const baseName = basename(sanitizedName, ext).slice(0, 50)
    const truncatedName = `${baseName}${ext}`

    const uniqueFilename = `${timestamp}-${truncatedName}`

    await putObject(uniqueFilename, processedBuffer, processedType)

    return await prisma.file.create({
        data: {
            name: uniqueFilename,
            type: processedType,
            privateUserId: options.privateUserId,
            alt: options.alt
        }
    })
}

export async function uploadFromExternalUrl(url: string, options: UploadFileOptions = DEFAULT_UPLOAD_OPTIONS) {
    options = { ...DEFAULT_UPLOAD_OPTIONS, ...options }

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`Failed to fetch image from URL: ${response.statusText}`)
    }

    const contentType = response.headers.get("Content-Type")?.split(";")[0].trim() ?? ""

    const pathExtension = new URL(url).pathname.split(".").pop()?.toLowerCase()
    const pathHasExtension = pathExtension && ALLOWED_FILE_TYPES.includes(pathExtension)

    const extension = pathHasExtension ? pathExtension : mimeExtension(contentType)

    if (!extension) {
        throw new Error("Could not determine file type from URL")
    }

    const blob = await response.blob()
    const file = new File([blob], `external.${extension}`, { type: contentType })

    return await uploadFile(file, options)
}
