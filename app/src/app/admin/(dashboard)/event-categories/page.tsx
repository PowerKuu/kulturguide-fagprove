"use client"

import { EventHeader } from "@/components/dashboard/event/EventHeader"
import Image from "next/image"
import { useEffect, useState } from "react"
import {  Event, EventCategory } from "@/prisma/client"
import { createEvent, getEvents } from "@/server/admin/actions/event"
import EventCard from "@/components/dashboard/event/EventCard"
import { createEventCategory, getEventCategories } from "@/server/admin/actions/eventCategory"
import { EditEventDialog } from "@/components/dashboard/event/EditEventDialog"
import { z } from "zod"
import { toast } from "sonner"
import EventCategoryCard from "@/components/dashboard/event-categories/EventCategoryCard"
import { EditEventCategoryDialog } from "@/components/dashboard/event-categories/EditEventCategoryDialog"
import { EventCategoryHeader } from "@/components/dashboard/event-categories/EventCategoryHeader"

export default function EventCategories() {
    const [categories, setCategories] = useState<EventCategory[]>([])

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const [editingEventCategoryId, setEditingEventCategoryId] = useState<string>()
    const [editingEventCategoryName, setEditingEventCategoryName] = useState<string>()

    useEffect(() => {
        getEventCategories().then(setCategories)
    }, [])

    async function handleCreateEventCategory() {
        const CreateEventCategorySchema = z.object({
            name: z.string()
        })

        const parsedCategory = CreateEventCategorySchema.safeParse({
            name: editingEventCategoryName
        })

        if (!parsedCategory.success) {
            toast.error("Please fill out all fields correctly.")
            return
        }

        await createEventCategory({
            ...parsedCategory.data
        })

        const updatedCategories = await getEventCategories()
        setCategories(updatedCategories)

        setIsEditDialogOpen(false)
    }

    return <div className="space-y-6">
        <EventCategoryHeader onCreateClick={() => { setIsEditDialogOpen(true) }} isLoading={false} />

        {categories.map((category) => (
            <EventCategoryCard key={category.id} eventCategory={category} />
        ))}

         <EditEventCategoryDialog
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}

            name={editingEventCategoryName}
            onNameChange={setEditingEventCategoryName}

            onCreateClick={handleCreateEventCategory}
        />
    </div>
}
