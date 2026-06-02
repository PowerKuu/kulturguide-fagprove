"use client"

import { EventCategory } from "@/prisma/client"

export default function EventCategoryCard({ eventCategory }: { eventCategory: EventCategory }) {
    return (
        <div className="rounded-lg border bg-card p-4">
            <h3 className="text-lg font-semibold">{eventCategory.name}</h3>
        </div>
    )
}