"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { getFileUrl } from "@/lib/utils"
import { Event, EventCategory } from "@/prisma/client"
import { format, isSameDay } from "date-fns"
import { nb } from "date-fns/locale"
import { ArrowLeft, Calendar, ChevronLeft, ChevronRight, Clock, Coins, ImageIcon, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

export default function EventDetails({
    event,
    category,
    imagesWithAlt
}: {
    event: Event
    category: EventCategory
    imagesWithAlt: { id: string; alt: string }[]
}) {
    const start = new Date(event.startDate)
    const end = event.endDate ? new Date(event.endDate) : null

    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`

    return (
        <div className="flex flex-col gap-8">
            <Link
                href="/events"
                className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
                <ArrowLeft className="h-4 w-4" />
                Tilbake til arrangementer
            </Link>

            <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
                <div className="lg:sticky lg:top-28">
                    <Carousel imagesWithAlt={imagesWithAlt} title={event.title} />
                </div>

                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                        <Badge variant="secondary" className="w-fit">
                            {category.name}
                        </Badge>
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{event.title}</h1>
                    </div>

                    <div className="flex flex-col gap-px overflow-hidden rounded-xl border bg-card">
                        <InfoRow icon={Calendar} label="Dato">
                            {end && !isSameDay(start, end)
                                ? `${format(start, "EEEE d. MMMM yyyy", { locale: nb })} - ${format(
                                      end,
                                      "EEEE d. MMMM yyyy",
                                      { locale: nb }
                                  )}`
                                : format(start, "EEEE d. MMMM yyyy", { locale: nb })}
                        </InfoRow>
                        <Separator />
                        <InfoRow icon={Clock} label="Tid">
                            {format(start, "HH:mm", { locale: nb })}
                            {end ? ` - ${format(end, "HH:mm", { locale: nb })}` : ""}
                        </InfoRow>
                        <Separator />
                        <InfoRow icon={MapPin} label="Sted">
                            <a
                                href={mapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline-offset-4 hover:underline"
                            >
                                {event.location}
                            </a>
                        </InfoRow>
                        <Separator />
                        <InfoRow icon={Coins} label="Pris">
                            {event.price > 0 ? `${event.price} kr` : "Gratis"}
                        </InfoRow>
                    </div>

                    {event.description && (
                        <div className="flex flex-col gap-2">
                            <p className="whitespace-pre-line leading-relaxed text-muted-foreground">
                                {event.description}
                            </p>
                        </div>
                    )}

                    <Button asChild size="lg" className="w-full sm:w-fit">
                        <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                            <MapPin className="mr-1 h-4 w-4" />
                            Vis på kart
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    )
}

function InfoRow({
    icon: Icon,
    label,
    children
}: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="flex items-start gap-3 px-4 py-3">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="flex flex-col">
                <span className="text-xs uppercase tracking-wide text-muted-foreground">{label}</span>
                <span className="font-medium capitalize">{children}</span>
            </div>
        </div>
    )
}

function Carousel({ imagesWithAlt, title }: { imagesWithAlt: { id: string; alt: string }[]; title: string }) {
    const [active, setActive] = useState(0)

    if (imagesWithAlt.length === 0) {
        return (
            <div className="flex aspect-square w-full items-center justify-center rounded-xl border bg-muted/20">
                <ImageIcon className="h-16 w-16 text-muted-foreground" />
            </div>
        )
    }

    const current = imagesWithAlt[active]

    function go(direction: number) {
        setActive((prev) => (prev + direction + imagesWithAlt.length) % imagesWithAlt.length)
    }

    return (
        <div className="flex flex-col gap-3">
            <div className="group relative aspect-square w-full overflow-hidden rounded-xl border bg-muted/20">
                <Image
                    key={current.id}
                    src={getFileUrl(current.id)}
                    alt={current.alt || title}
                    fill
                    priority
                    className="object-cover"
                />

                {imagesWithAlt.length > 1 && (
                    <>
                        <button
                            type="button"
                            onClick={() => go(-1)}
                            aria-label="Forrige bilde"
                            className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-sm backdrop-blur transition hover:bg-background"
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            type="button"
                            onClick={() => go(1)}
                            aria-label="Neste bilde"
                            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-background/80 p-2 text-foreground shadow-sm backdrop-blur transition hover:bg-background"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>

                        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                            {imagesWithAlt.map((image, index) => (
                                <button
                                    key={image.id}
                                    type="button"
                                    onClick={() => setActive(index)}
                                    aria-label={`Gå til bilde ${index + 1}`}
                                    className={`h-2 rounded-full transition-all ${
                                        index === active
                                            ? "w-6 bg-background"
                                            : "w-2 bg-background/60 hover:bg-background/80"
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {imagesWithAlt.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {imagesWithAlt.map((image, index) => (
                        <button
                            key={image.id}
                            type="button"
                            onClick={() => setActive(index)}
                            aria-label={`Vis bilde ${index + 1}`}
                            className={`relative aspect-square overflow-hidden rounded-md border transition ${
                                index === active
                                    ? "ring-2 ring-primary ring-offset-2 ring-offset-background"
                                    : "opacity-70 hover:opacity-100"
                            }`}
                        >
                            <Image src={getFileUrl(image.id)} alt={image.alt || title} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}
