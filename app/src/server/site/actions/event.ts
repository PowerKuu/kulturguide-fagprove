"use server"

import { Prisma, Event } from "@/prisma/client"
import { prisma } from "@/server/database/prisma"
import { embedText } from "@/server/embedding/embedding"

export async function getFeaturedEvents() {
    const events: Event[] = await prisma.$queryRaw`
        SELECT *
        FROM "Event"
        WHERE "featured" = true
        ORDER BY
            CASE WHEN "startDate" >= CURRENT_DATE THEN 0 ELSE 1 END ASC,
            ABS(EXTRACT(EPOCH FROM ("startDate" - NOW()))) ASC
    `

    return await Promise.all(
        events.map(async (event) => {
            const category = await prisma.eventCategory.findUnique({ where: { id: event.categoryId } })
            if (!category) {
                throw new Error(`Category not found for event ${event.id}`)
            }

            return {
                ...event,
                category
            }
        })
    )
}

export async function getEvent(id: string) {
    const event = await prisma.event.findUnique({
        where: { id },
        include: {
            category: true
        }
    })

    if (!event) {
        throw new Error("Event not found")
    }

    return event
}

export async function getFilteredEvents({ search, categoryId, minPrice, maxPrice }: { search?: string; categoryId?: string; minPrice?: number; maxPrice?: number }) {
    const MAX_SEARCH_DISTANCE = 1

    const orderByParts: Prisma.Sql[] = []
    const whereParts: Prisma.Sql[] = []

    if (search) {
        const embedding = await embedText(search, true)
        const embeddingValue = `[${embedding.join(",")}]`

        orderByParts.push(Prisma.sql`"embedding" <=> ${embeddingValue}::halfvec`)

        whereParts.push(Prisma.sql`"embedding" IS NOT NULL`)
        whereParts.push(Prisma.sql`"embedding" <=> ${embeddingValue}::halfvec <= ${MAX_SEARCH_DISTANCE}`)
    }

    if (categoryId) {
        whereParts.push(Prisma.sql`"categoryId" = ${categoryId}`)
    }

    orderByParts.push(Prisma.sql`CASE WHEN "startDate" >= CURRENT_DATE THEN 0 ELSE 1 END ASC`)
    orderByParts.push(Prisma.sql`ABS(EXTRACT(EPOCH FROM ("startDate" - NOW()))) ASC`)
    whereParts.push(Prisma.sql`"id" IS NOT NULL`)

    if (minPrice !== undefined) {
        whereParts.push(Prisma.sql`"price" >= ${minPrice}`)
    }

    if (maxPrice !== undefined) {
        whereParts.push(Prisma.sql`"price" <= ${maxPrice}`)
    }

    const events: Event[] = await prisma.$queryRaw`
        SELECT *
        FROM "Event"
        WHERE ${Prisma.join(whereParts, " AND ")}
        ORDER BY ${Prisma.join(orderByParts, ", ")}
    `

    return await Promise.all(
        events.map(async (event) => {
            const category = await prisma.eventCategory.findUnique({ where: { id: event.categoryId } })
            if (!category) {
                throw new Error(`Category not found for event ${event.id}`)
            }

            return {
                ...event,
                category
            }
        })
    )
}
