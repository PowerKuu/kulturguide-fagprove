"use client"

import { EventHeader } from "@/components/dashboard/event/EventHeader"
import Image from "next/image"
import { useEffect, useState } from "react"
import {  Event, EventCategory } from "@/prisma/client"
import { createEvent, getEvents } from "@/server/admin/actions/event"
import EventCard from "@/components/dashboard/event/EventCard"
import { getEventCategories } from "@/server/admin/actions/eventCategory"
import { EditEventDialog } from "@/components/dashboard/event/EditEventDialog"
import { set, z } from "zod"
import { toast } from "sonner"

export default function Events() {
    const [events, setEvents] = useState<Event[]>([])
    const [categories, setCategories] = useState<EventCategory[]>([])

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const [editingEventId, setEditingEventId] = useState<string>()
    const [editingEventTitle, setEditingEventTitle] = useState<string>()
    const [editingEventCategoryId, setEditingEventCategoryId] = useState<string>()
    const [editingEventDescription, setEditingEventDescription] = useState<string>()
    const [editingEventDate, setEditingEventDate] = useState<string>()
    const [editingEventLocation, setEditingEventLocation] = useState<string>()
    const [editingEventPrice, setEditingEventPrice] = useState<string >()

    useEffect(() => {
        getEvents().then(setEvents)
        getEventCategories().then(setCategories)
    }, [])

    async function handleEditEvent() {
        const CreateEventSchema = z.object({
            title: z.string(),
            description: z.string(),
            startDate: z.string().transform((value) => new Date(value)),
            location: z.string(),
            price: z.string().transform((value) => parseFloat(value)),
            categoryId: z.string()
        })

        const parsedEvent = CreateEventSchema.safeParse({
            title: editingEventTitle,
            description: editingEventDescription,
            startDate: editingEventDate,
            location: editingEventLocation,
            price: editingEventPrice,
            categoryId: editingEventCategoryId
        })

        if (!parsedEvent.success) {
            toast.error("Please fill out all fields correctly.")
            return
        }

        const { categoryId, ...eventData } = parsedEvent.data

        await createEvent({
            ...eventData,
            category: {connect: { id: categoryId } }
        })

        const updatedEvents = await getEvents()
        setEvents(updatedEvents)

        setIsEditDialogOpen(false)

        setEditingEventTitle("")
        setEditingEventDescription("")
        setEditingEventDate("")
        setEditingEventLocation("")
        setEditingEventPrice("")
        setEditingEventCategoryId("")
    }

    return <div className="space-y-6">
        <EventHeader onCreateClick={() => { setIsEditDialogOpen(true) }} isLoading={false} />

        {events.map((event) => (
            <EventCard key={event.id} event={event} />
        ))}

         <EditEventDialog
            categories={categories}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}

            title={editingEventTitle}
            onTitleChange={setEditingEventTitle}
            categoryId={editingEventCategoryId}
            onCategoryIdChange={setEditingEventCategoryId}
            description={editingEventDescription}
            onDescriptionChange={setEditingEventDescription}
            date={editingEventDate}
            onDateChange={setEditingEventDate}
            location={editingEventLocation}
            onLocationChange={setEditingEventLocation}
            price={editingEventPrice}
            onPriceChange={setEditingEventPrice}

            onCreateClick={handleEditEvent}
        />
    </div>
}
