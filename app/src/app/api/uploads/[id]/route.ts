import sharp from "sharp"
import { getSession } from "@/server/auth/session"
import { getFile, readFileBuffer, readFileStream } from "@/server/uploads/read"
import { NextRequest, NextResponse } from "next/server"

const COMPRESS_QUALITY = 90

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const session = await getSession(request)

    try {
        const file = await getFile(id)

        if (file.privateUserId && file.privateUserId !== session?.user?.id) {
            return new NextResponse("Unauthorized", { status: 401 })
        }

        const wParam = request.nextUrl.searchParams.get("w")
        const qParam = request.nextUrl.searchParams.get("q")
        const compressed = request.nextUrl.searchParams.get("compressed") === "true"
        const targetWidth = wParam ? parseInt(wParam, 10) : undefined
        const quality = qParam ? Math.min(100, Math.max(1, parseInt(qParam, 10))) : COMPRESS_QUALITY

        const etag = `"${file.id}-${targetWidth ?? ""}-${compressed ? "1" : "0"}-${quality}"`
        const cacheControl = file.privateUserId
            ? "private, max-age=31536000, immutable"
            : "public, max-age=31536000, immutable"

        if (request.headers.get("If-None-Match") === etag) {
            return new NextResponse(null, {
                status: 304,
                headers: { ETag: etag, "Cache-Control": cacheControl }
            })
        }

        const isImage = file.type.startsWith("image/")
        const needsTransform = isImage && (targetWidth || compressed)
        const rangeHeader = request.headers.get("Range")

        if (!needsTransform && !rangeHeader) {
            const { stream, contentLength, contentType } = await readFileStream(file)
            const headers: Record<string, string> = {
                "Content-Type": contentType || file.type,
                ETag: etag,
                "Cache-Control": cacheControl,
                "Accept-Ranges": "bytes"
            }
            if (contentLength) headers["Content-Length"] = String(contentLength)
            return new NextResponse(stream, { headers })
        }

        const buffer = await readFileBuffer(file)
        const total = buffer.byteLength

        if (rangeHeader) {
            const [startStr, endStr] = rangeHeader.replace(/bytes=/, "").split("-")
            const start = parseInt(startStr, 10)
            const end = endStr ? parseInt(endStr, 10) : total - 1

            return new NextResponse(new Uint8Array(buffer).subarray(start, end + 1), {
                status: 206,
                headers: {
                    "Content-Type": file.type,
                    "Content-Range": `bytes ${start}-${end}/${total}`,
                    "Accept-Ranges": "bytes",
                    "Content-Length": String(end - start + 1),
                    ETag: etag,
                    "Cache-Control": cacheControl
                }
            })
        }

        let pipe = sharp(buffer)
        if (targetWidth && !isNaN(targetWidth)) {
            pipe = pipe.resize({ width: targetWidth, withoutEnlargement: true })
        }
        pipe = pipe.webp({ quality })
        const processed = await pipe.toBuffer()
        return new NextResponse(new Uint8Array(processed), {
            headers: {
                "Content-Type": "image/webp",
                ETag: etag,
                "Cache-Control": cacheControl
            }
        })
    } catch (error) {
        return new NextResponse(error instanceof Error ? error.message : "Error reading file", { status: 404 })
    }
}
