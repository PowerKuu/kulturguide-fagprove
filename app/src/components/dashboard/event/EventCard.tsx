"use client"

import { Event } from "@/prisma/client"

export default function EventCard({ event }: { event: Event }) {
    return (
        <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold">{event.title}</h3>
            <p className="text-sm text-muted-foreground">{event.description}</p>
        </div>
    )
}