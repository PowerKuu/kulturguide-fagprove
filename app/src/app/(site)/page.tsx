"use client"

import EventCard from "@/components/site/EventCard"
import { Button } from "@/components/ui/button"
import { Event, EventCategory } from "@/prisma/client"
import { getFeaturedEvents } from "@/server/site/actions/event"
import { ArrowRight } from "lucide-react"
import Link from "next/dist/client/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Home() {
    const [featuredEvents, setFeaturedEvents] = useState<(Event & { category: EventCategory })[]>([])

    useEffect(() => {
        getFeaturedEvents().then(setFeaturedEvents) 
    }, [])

    return (
        <div className="flex flex-col gap-20">
            <div>
                <div>
                    <h1 className="text-4xl font-bold mb-4">Bergen kulturguide</h1>
                    <p className="text-muted-foreground">
                        Oppdag arrangementer i Bergen, utforsk kulturtilbudet og finn spennende ting å gjøre i byen.
                    </p>
                    <Link href="/events">
                        <Button className="mt-6" size="lg">
                            Se arrangementer
                        </Button>
                    </Link>
                </div>
                <div className="mt-8">
                    <Image
                        src="/images/hero.avif"
                        alt="Kulturguide hero image"
                        width={1200}
                        height={600}
                        className="rounded-lg object-cover w-full h-auto"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold">Utvalgte arrangementer</h2>
                {
                    featuredEvents.length === 0 ? (
                        <p className="text-muted-foreground">Ingen utvalgte arrangementer for øyeblikket.</p>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {featuredEvents.map(event => (
                                <EventCard key={event.id} event={event} category={event.category} firstImageId={event.mediaIds[0]} />
                            ))}
                        </div>
                    )
                }
                <Link href="/events">
                    <Button variant="outline">
                        Se alle arrangementer
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
    )
}
