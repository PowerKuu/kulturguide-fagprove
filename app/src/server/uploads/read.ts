import { File } from "@/prisma/client"
import { prisma } from "../database/prisma"
import { getObject, getObjectStream } from "./r2client"
import { absoluteUrl, getFileUrl } from "@/lib/utils"

export async function getFile(id: string): Promise<File> {
    const file = await prisma.file.findUnique({ where: { id } })

    if (!file) {
        throw new Error("File not found")
    }

    return file
}

export async function readFileBuffer(file: File): Promise<Buffer> {
    const buffer = await getObject(file.name)
    return buffer
}

export function readFileStream(file: File) {
    return getObjectStream(file.name)
}

export async function fileToBase64(file: File): Promise<string> {
    const buffer = await readFileBuffer(file)
    return buffer.toString("base64")
}

export function getExternalUrl(fileId: string): string {
    return absoluteUrl(getFileUrl(fileId))
}
