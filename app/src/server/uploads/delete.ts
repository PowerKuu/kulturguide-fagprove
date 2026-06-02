import { prisma } from "../database/prisma"
import { deleteObject } from "./r2client"

export async function deleteFiles(fileIds: string[]) {
    return Promise.all(
        fileIds.map(async (id) => {
            const file = await prisma.file.findUnique({ where: { id } })
            if (!file) return

            await deleteObject(file.name)

            await prisma.file.delete({ where: { id } })
        })
    )
}
