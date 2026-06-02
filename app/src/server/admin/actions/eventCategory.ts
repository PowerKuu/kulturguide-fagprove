"use server"
import { Prisma } from "@/prisma/client"
import { prisma } from "@/server/database/prisma"

export async function getEventCategories() {
    return prisma.eventCategory.findMany()
}

export async function createEventCategory(category: Prisma.EventCategoryCreateInput) {
    return prisma.eventCategory.create({
        data: category
    })
}