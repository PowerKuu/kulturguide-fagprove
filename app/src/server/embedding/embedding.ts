import { Prisma } from "@/prisma/client"
import { embed } from "ai"
import { prisma } from "../database/prisma"
import { capitalize } from "@/lib/utils"

const embeddingModels: Prisma.ModelName[] = ["Event"] as const
const queryCache = new Map<string, number[]>()
const MAX_CACHE_SIZE = 5_000
const EVICT_BATCH = Math.max(1, Math.floor(MAX_CACHE_SIZE * 0.1))

export async function embedText(text: string, query = false): Promise<number[]> {
    const cacheKey = text.toLowerCase().trim()

    if (queryCache.has(cacheKey) && query) {
        const cached = queryCache.get(cacheKey)!
        queryCache.delete(cacheKey)
        queryCache.set(cacheKey, cached)
        return cached
    }

    const { embedding } = await embed({
        model: "google/gemini-embedding-001",
        value: text,
        providerOptions: {
            google: { taskType: query ? "RETRIEVAL_QUERY" : "RETRIEVAL_DOCUMENT" }
        }
    })

    if (query) {
        queryCache.set(cacheKey, embedding)
    }

    if (queryCache.size > MAX_CACHE_SIZE) {
        let toEvict = queryCache.size - MAX_CACHE_SIZE + EVICT_BATCH
        for (const key of queryCache.keys()) {
            if (toEvict-- <= 0) break
            queryCache.delete(key)
        }
    }

    return embedding
}

export async function insertEmbedding<M extends (typeof embeddingModels)[number]>(
    model: M,
    id: string,
    embedding: number[]
) {
    const embeddingValue = `[${embedding.join(",")}]`

    await prisma.$executeRaw`
        UPDATE ${Prisma.raw(`"${model}"`)}
        SET embedding = ${embeddingValue}::halfvec
        WHERE id = ${id}
    `
}

export function joinEmbeddingText(embeddingText: (string | null | undefined)[]): string {
    return capitalize(embeddingText.filter(Boolean).join(" "))
}
