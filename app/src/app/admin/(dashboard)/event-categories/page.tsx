"use client"

import { EventHeader } from "@/components/dashboard/event/EventHeader"
import Image from "next/image"
import { useEffect, useState } from "react"
import { Event, EventCategory } from "@/prisma/client"
import { createEvent, getEvents } from "@/server/admin/actions/event"
import EventCard from "@/components/dashboard/event/EventCard"
import {
    createEventCategory,
    deleteEventCategory,
    getEventCategories,
    updateEventCategory
} from "@/server/admin/actions/eventCategory"
import { EditEventDialog } from "@/components/dashboard/event/EditEventDialog"
import { set, z } from "zod"
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

    async function handleEditEventCategory() {
        const CreateEventCategorySchema = z.object({
            name: z.string().nonempty("Name is required")
        })

        const parsedCategory = CreateEventCategorySchema.safeParse({
            name: editingEventCategoryName
        })

        if (!parsedCategory.success) {
            toast.error("Please fill out all fields correctly.")
            return
        }

        if (editingEventCategoryId) {
            await updateEventCategory(editingEventCategoryId, {
                ...parsedCategory.data
            })
        } else {
            await createEventCategory({
                ...parsedCategory.data
            })
        }

        const updatedCategories = await getEventCategories()
        setCategories(updatedCategories)

        setIsEditDialogOpen(false)
    }

    async function handleDeleteEventCategory(id: string) {
        await deleteEventCategory(id)
        const updatedCategories = await getEventCategories()
        setCategories(updatedCategories)
    }

    return (
        <div className="space-y-6">
            <EventCategoryHeader
                onCreateClick={() => {
                    setEditingEventCategoryId(undefined)
                    setEditingEventCategoryName("")
                    setIsEditDialogOpen(true)
                }}
                isLoading={false}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {categories.map((category) => (
                    <EventCategoryCard
                        key={category.id}
                        eventCategory={category}
                        onEditClick={() => {
                            setEditingEventCategoryId(category.id)
                            setEditingEventCategoryName(category.name)
                            setIsEditDialogOpen(true)
                        }}
                        onDeleteClick={async () => {
                            handleDeleteEventCategory(category.id)
                        }}
                    />
                ))}
            </div>
            <EditEventCategoryDialog
                eventCategoryId={editingEventCategoryId}
                open={isEditDialogOpen}
                onOpenChange={setIsEditDialogOpen}
                name={editingEventCategoryName}
                onNameChange={setEditingEventCategoryName}
                onCreateClick={handleEditEventCategory}
            />
        </div>
    )
}
