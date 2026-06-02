"use server"
import { Prisma } from "@/prisma/browser"
import { prisma } from "@/server/database/prisma"

export async function getEvents() {
    return prisma.event.findMany()
}

export async function createEvent(event: Prisma.EventCreateInput) {
    return prisma.event.create({
        data:event
    })
}