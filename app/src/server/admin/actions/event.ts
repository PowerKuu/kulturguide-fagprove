"use server"
import { Prisma } from "@/prisma/browser"
import { requireAdmin } from "@/server/auth/guard"
import { prisma } from "@/server/database/prisma"
import { embedText, insertEmbedding, joinEmbeddingText } from "@/server/embedding/embedding"

export async function getEvents() {
    requireAdmin()
    return prisma.event.findMany({
        orderBy: {
            createdAt: "desc"
        },
        include: {
            category: true
        }
    })
}

export async function createEvent(event: Prisma.EventCreateInput) {
    requireAdmin()
    const newEvent = await prisma.event.create({
        data: event
    })

    const embedding = joinEmbeddingText([newEvent.title, newEvent.description, newEvent.location])
    await insertEmbedding("Event", newEvent.id, await embedText(embedding))
    return newEvent
}

export async function updateEvent(id: string, event: Prisma.EventUpdateInput) {
    requireAdmin()
    const updatedEvent = await prisma.event.update({
        where: { id },
        data: event
    })

    const embedding = joinEmbeddingText([updatedEvent.title, updatedEvent.description, updatedEvent.location])
    await insertEmbedding("Event", updatedEvent.id, await embedText(embedding))
    return updatedEvent
}

export async function deleteEvent(id: string) {
    requireAdmin()
    return prisma.event.delete({
        where: { id }
    })
}
