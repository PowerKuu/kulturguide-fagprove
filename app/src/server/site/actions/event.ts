"use server"

import { Prisma, Event } from "@/prisma/client"
import { prisma } from "@/server/database/prisma"
import { embedText } from "@/server/embedding/embedding"

export async function getFeaturedEvents() {
    return await prisma.event.findMany({
        where: {
            featured: true
        },
        include: {
            category: true
        },
        orderBy: {
            createdAt: "desc"
        }
    })
}

export async function getFilteredEvents({ search, categoryId }: { search?: string, categoryId?: string }) {
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

    orderByParts.push(Prisma.sql`"createdAt" DESC`)
    whereParts.push(Prisma.sql`"id" IS NOT NULL`)

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
