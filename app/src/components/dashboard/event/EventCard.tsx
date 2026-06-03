"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getFileUrl } from "@/lib/utils"
import { Event } from "@/prisma/client"
import { Calendar, Coins, Edit, ImageIcon, Map, MapPin, Trash2 } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { EventCategory } from "@/prisma/browser"

export default function EventCard({
    event,
    category,
    firstImageId,
    onEditClick,
    onDeleteClick
}: {
    event: Event
    category: EventCategory
    firstImageId?: string
    onEditClick: () => void
    onDeleteClick: () => void
}) {
    return (
        <Card className="group cursor-pointer overflow-hidden gap-0 pt-0 w-full">
            <CardContent className="relative aspect-square p-0">
                {firstImageId ? (
                    <Image
                        src={getFileUrl(firstImageId)}
                        alt={event.title || "Event image"}
                        fill
                        className="object-cover object-top"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center bg-muted/20">
                        <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    </div>
                )}
                <div className="absolute right-2 top-2 flex flex-col gap-1">
                    <Button
                        size="icon-sm"
                        variant="secondary"
                        onClick={(e) => {
                            e.stopPropagation()
                            onEditClick()
                        }}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        size="icon-sm"
                        variant="secondary"
                        onClick={(e) => {
                            e.stopPropagation()
                            onDeleteClick()
                        }}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>

            <CardFooter className="flex flex-col items-start gap-2 p-3 h-full">
                <p className="line-clamp-2 text-lg font-semibold">{event.title}</p>
                {event.description && <p className="line-clamp-2">{event.description}</p>}

                <div className="flex flex-wrap mt-auto gap-1">
                    <Badge variant="default" className="text-xs">
                        {category.name}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        <Calendar className="mr-1 h-3 w-3" />
                        {format(new Date(event.startDate), "MMM d, yyyy")}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        <MapPin className="mr-1 h-3 w-3" />

                        {event.location}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                        <Coins className="mr-1 h-3 w-3" />
                        {event.price} kr
                    </Badge>
                </div>
            </CardFooter>
        </Card>
    )
}
