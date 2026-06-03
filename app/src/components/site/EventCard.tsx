"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getFileUrl } from "@/lib/utils"
import { Event } from "@/prisma/client"
import { ArrowRight, Calendar, Coins, Edit, ImageIcon, Map, MapPin, Trash2 } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { EventCategory } from "@/prisma/browser"
import { getFileAlt } from "@/server/site/actions/uploads"
import { useEffect, useState } from "react"
import Link from "next/link"

export default function EventCard({
    event,
    category,
    firstImageId
}: {
    event: Event
    category: EventCategory
    firstImageId?: string
}) {
    const [alt, setAlt] = useState("")

    useEffect(() => {
        if (firstImageId) {
            getFileAlt(firstImageId).then(setAlt)
        }
    }, [firstImageId])

    return (
        <Link href={`/events/${event.id}`} className="w-full">
            <Card className="group cursor-pointer overflow-hidden gap-0 pt-0 w-full">
                <CardContent className="relative aspect-square p-0">
                    {firstImageId ? (
                        <Image src={getFileUrl(firstImageId)} alt={alt} fill className="object-cover object-top" />
                    ) : (
                        <div className="flex h-full items-center justify-center bg-muted/20">
                            <ImageIcon className="h-12 w-12 text-muted-foreground" />
                        </div>
                    )}
                    <div className="absolute right-2 top-2">
                        <Badge variant="default" className="text-xs">
                            {category.name}
                        </Badge>
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col items-start gap-2 p-3 h-full">
                    <p className="line-clamp-2 text-lg font-semibold">{event.title}</p>

                    <div className="flex flex-wrap mt-auto gap-1">
                        <Badge variant="outline" className="text-xs">
                            <Calendar className="mr-1 h-3 w-3" />
                            {format(new Date(event.startDate), "MMM d, yyyy")}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                            <MapPin className="mr-1 h-3 w-3" />

                            {event.location}
                        </Badge>
                    </div>
                    {event.description && <p className="line-clamp-2">{event.description}</p>}
                    <div className="w-full flex justify-between items-center mt-3">
                        <Button variant="outline" size="sm">
                            Se detaljer
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <div className="flex items-center font-semibold">{event.price} kr</div>
                    </div>
                </CardFooter>
            </Card>
        </Link>
    )
}
