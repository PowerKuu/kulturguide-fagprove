"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { getFileUrl } from "@/lib/utils"
import { EventCategory } from "@/prisma/client"
import { ImageIcon, Edit, Trash2, Badge, Calendar, MapPin, Coins } from "lucide-react"
import { format } from "path"

export default function EventCategoryCard({
    eventCategory,
    onEditClick,
    onDeleteClick
}: {
    eventCategory: EventCategory
    onEditClick: () => void
    onDeleteClick: () => void
}) {
    return (
        <Card className="group cursor-pointer overflow-hidden gap-0 pt-0 w-full">
            <CardFooter className="flex flex-col items-start gap-2 p-3 h-full  border-0 bg-muted/20">
                <p className="line-clamp-2 text-lg font-semibold">{eventCategory.name}</p>
                <div>
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
            </CardFooter>
        </Card>
    )
}
