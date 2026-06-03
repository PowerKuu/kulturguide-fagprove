import EventDetails from "@/components/site/EventDetails"
import { getEvent } from "@/server/site/actions/event"
import { getFileAlt } from "@/server/site/actions/uploads"

export default async function EventPage({ params }: { params: Promise<{ eventId: string }> }) {
    const eventId = (await params).eventId
    const event = await getEvent(eventId)

    const imagesWithAlt = await Promise.all(event.mediaIds.map(async (id) => ({ id, alt: await getFileAlt(id) })))
    const sortedImagesWithAlt = imagesWithAlt.sort((a, b) => {
        const aIndex = event.mediaIds.indexOf(a.id)
        const bIndex = event.mediaIds.indexOf(b.id)
        return aIndex - bIndex
    })

    return <EventDetails event={event} category={event.category} imagesWithAlt={sortedImagesWithAlt} />
}
