"use server"

import { prisma } from "@/server/database/prisma"

export async function getFileAlt(id: string) {
    const file = await prisma.file.findUnique({
        where: { id }
    })
    return file?.alt || ""
    
}