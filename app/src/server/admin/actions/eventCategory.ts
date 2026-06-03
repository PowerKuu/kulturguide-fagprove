"use server"
import { Prisma } from "@/prisma/client"
import { requireAdmin } from "@/server/auth/guard"
import { prisma } from "@/server/database/prisma"
import { insertEmbedding, joinEmbeddingText } from "@/server/embedding/embedding"

export async function getEventCategories() {
    requireAdmin()
    return prisma.eventCategory.findMany({
        orderBy: {
            createdAt: "asc"
        }
    })
}

export async function createEventCategory(category: Prisma.EventCategoryCreateInput) {
    requireAdmin()
    return prisma.eventCategory.create({
        data: category
    })
}

export async function updateEventCategory(id: string, category: Prisma.EventCategoryUpdateInput) {
    requireAdmin()
    return prisma.eventCategory.update({
        where: { id },
        data: category
    })
}

export async function deleteEventCategory(id: string) {
    requireAdmin()
    return prisma.eventCategory.delete({
        where: { id }
    })
}