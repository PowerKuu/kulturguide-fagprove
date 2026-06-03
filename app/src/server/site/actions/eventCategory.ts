"use server"

import { prisma } from "@/server/database/prisma"

export async function getEventCategories() {
    return prisma.eventCategory.findMany({
        orderBy: {
            createdAt: "asc"
        }
    })
}
