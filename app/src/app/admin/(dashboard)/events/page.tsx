"use client"

import { EventHeader } from "@/components/dashboard/event/EventHeader"
import Image from "next/image"
import { useEffect, useState } from "react"
import {  Event, EventCategory } from "@/prisma/client"
import { createEvent, deleteEvent, getEvents, updateEvent } from "@/server/admin/actions/event"
import EventCard from "@/components/dashboard/event/EventCard"
import { getEventCategories } from "@/server/admin/actions/eventCategory"
import { EditEventDialog } from "@/components/dashboard/event/EditEventDialog"
import { z } from "zod"
import { toast } from "sonner"

export default function Events() {
    const [events, setEvents] = useState<(Event & { category: EventCategory })[]>([])
    const [categories, setCategories] = useState<EventCategory[]>([])

    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

    const [editingEventId, setEditingEventId] = useState<string>()
    const [editingEventTitle, setEditingEventTitle] = useState<string>()
    const [editingEventCategoryId, setEditingEventCategoryId] = useState<string>()
    const [editingEventDescription, setEditingEventDescription] = useState<string>()
    const [editingEventDate, setEditingEventDate] = useState<string>()
    const [editingEventLocation, setEditingEventLocation] = useState<string>()
    const [editingEventPrice, setEditingEventPrice] = useState<string >()
    const [editingEventImageIds, setEditingEventImageIds] = useState<string[]>([])

    useEffect(() => {
        getEvents().then(setEvents)
        getEventCategories().then(setCategories)
    }, [])

    async function handleEditEvent() {
        const CreateEventSchema = z.object({
            title: z.string().nonempty("Title is required"),
            description: z.string().nonempty("Description is required"),
            startDate: z.string().nonempty("Date is required").transform((value) => new Date(value)),
            location: z.string().nonempty("Location is required"),
            price: z.string().nonempty("Price is required").transform((value) => parseFloat(value)),
            categoryId: z.string().nonempty("Category is required"),
            mediaIds: z.array(z.string()).min(1, "At least one image is required")
        })

        const parsedEvent = CreateEventSchema.safeParse({
            title: editingEventTitle,
            description: editingEventDescription,
            startDate: editingEventDate,
            location: editingEventLocation,
            price: editingEventPrice,
            categoryId: editingEventCategoryId,
            mediaIds: editingEventImageIds
        })
        
        if (!parsedEvent.success) {
            toast.error(parsedEvent.error.issues[0]?.message || "Please fill out all fields correctly.")
            return
        }

        const { categoryId, ...eventData } = parsedEvent.data

        if (editingEventId) {
            await updateEvent(editingEventId, {
                ...eventData,
                category: {connect: { id: categoryId } }
            })
        } else {
             await createEvent({
                ...eventData,
                category: {connect: { id: categoryId } }
            })
        }
        

        const updatedEvents = await getEvents()
        setEvents(updatedEvents)

        setIsEditDialogOpen(false)

        setEditingEventTitle("")
        setEditingEventDescription("")
        setEditingEventDate("")
        setEditingEventLocation("")
        setEditingEventPrice("")
        setEditingEventCategoryId("")
        setEditingEventImageIds([])
    }
    
    async function handleDeleteEvent(id: string) {
        await deleteEvent(id)
        const updatedEvents = await getEvents()
        setEvents(updatedEvents)
    }

    return <div className="space-y-6">
        <EventHeader onCreateClick={() => { 
            setEditingEventId(undefined) 
            setEditingEventTitle("")
            setEditingEventDescription("")
            setEditingEventDate("")
            setEditingEventLocation("")
            setEditingEventPrice("")
            setEditingEventCategoryId("")
            setEditingEventImageIds([])
            setIsEditDialogOpen(true) 
        }} isLoading={false} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {events.map((event) => (
                <EventCard key={event.id} event={event} category={event.category} firstImageId={event.mediaIds?.[0]} onEditClick={() => {
                    setEditingEventId(event.id)
                    setEditingEventTitle(event.title)
                    setEditingEventDescription(event.description || "")
                    setEditingEventDate(event.startDate.toISOString().slice(0, 16))
                    setEditingEventLocation(event.location)
                    setEditingEventPrice(event.price.toString())
                    setEditingEventCategoryId(event.categoryId)
                    setEditingEventImageIds(event.mediaIds || [])
                    setIsEditDialogOpen(true)
                }} onDeleteClick={() => handleDeleteEvent(event.id)} />
            ))}
        </div>
         <EditEventDialog
            categories={categories}
            open={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            eventId={editingEventId}

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
            imageIds={editingEventImageIds}
            onImageIdsChange={setEditingEventImageIds}


            onCreateClick={handleEditEvent}
        />
    </div>
}
