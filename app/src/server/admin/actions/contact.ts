"use server"

import { requireAdmin } from "@/server/auth/guard"
import { prisma } from "@/server/database/prisma"

export async function getContact() {
    await requireAdmin()

    return prisma.contact.findMany({
        orderBy: {
            createdAt: "desc"
        }
    })
}
