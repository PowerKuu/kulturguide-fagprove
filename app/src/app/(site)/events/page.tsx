"use client"

import EventCard from "@/components/site/EventCard"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Event, EventCategory } from "@/prisma/client"
import { getFilteredEvents } from "@/server/site/actions/event"
import { getEventCategories } from "@/server/site/actions/eventCategory"
import { useEffect, useState } from "react"

export default function Events() {
    const [events, setEvents] = useState<(Event & { category: EventCategory })[]>([])
    const [categories, setCategories] = useState<EventCategory[]>([])

    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>()
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)
    const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout>()
    const DEBOUNCE_DELAY = 200

    function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        setSearchQuery(value)

        if (debounceTimeout) {
            clearTimeout(debounceTimeout)
        }

        if (value === "") {
            setDebouncedSearchQuery("")
            return
        }

        const timeout = setTimeout(() => {
            setDebouncedSearchQuery(value)
        }, DEBOUNCE_DELAY)

        setDebounceTimeout(timeout)
    }

    useEffect(() => {
        getEventCategories().then(setCategories)
    }, [])

    useEffect(() => {
        getFilteredEvents({
            search: debouncedSearchQuery,
            categoryId: selectedCategoryId === "all" ? undefined : selectedCategoryId
        }).then(setEvents)
    }, [debouncedSearchQuery, selectedCategoryId])

    return (
        <div className="flex flex-col gap-4">
            <div>
                <h1 className="text-4xl font-bold mb-4">Arrangemnter</h1>
                <p className="text-muted-foreground">
                    Oppdag arrangementer i Bergen, utforsk kulturtilbudet og finn spennende ting å gjøre i byen.
                </p>
            </div>{" "}
            <div className="flex gap-2">
                <Input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Søk etter arrangementer, steder eller kategorier..."
                />
                <Select onValueChange={setSelectedCategoryId} defaultValue="all">
                    <SelectTrigger>
                        <SelectValue>
                            {categories.find((c) => c.id === selectedCategoryId)?.name || "Alle kategorier"}
                        </SelectValue>
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value="all">Alle kategorier</SelectItem>
                        {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                                {category.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {events.length === 0 ? (
                <p className="text-muted-foreground">Ingen utvalgte arrangementer for øyeblikket.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard
                            key={event.id}
                            event={event}
                            category={event.category}
                            firstImageId={event.mediaIds[0]}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
