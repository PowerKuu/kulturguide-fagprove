"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EventCategory } from "@/prisma/client"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Trash2 } from "lucide-react"
import { getFileUrl } from "@/lib/utils"
import Image from "next/image"
import { useState } from "react"
import { Toggle } from "@/components/ui/toggle"
import { Switch } from "@/components/ui/switch"
import path from "path"

export function EditEventDialog({
    eventId,
    categories,

    open,
    onOpenChange,

    categoryId,
    onCategoryIdChange,

    title,
    onTitleChange,

    price,
    onPriceChange,

    date,
    onDateChange,

    location,
    onLocationChange,

    description,
    onDescriptionChange,

    featured,
    onFeaturedChange,

    imageIds,
    onImageIdsChange,

    onCreateClick,
    error
}: {
    eventId?: string
    categories: EventCategory[]

    open: boolean
    onOpenChange: (open: boolean) => void

    categoryId?: string
    onCategoryIdChange: (value: string) => void

    title?: string
    onTitleChange: (value: string) => void

    price?: string
    onPriceChange: (value: string) => void

    date?: string
    onDateChange: (value: string) => void

    location?: string
    onLocationChange: (value: string) => void

    description?: string
    onDescriptionChange: (value: string) => void

    featured?: boolean
    onFeaturedChange: (value: boolean) => void

    imageIds: string[]
    onImageIdsChange: (value: string[]) => void

    onCreateClick: () => void
    error?: string
}) {
    async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const files = e.target.files
        if (!files) return

        const newImageIds: string[] = []

        for (const file of files) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`File ${file.name} is larger than 5MB and was not uploaded.`)
                return
            }

            const formData = new FormData()
            formData.append("file", file)
            formData.append("alt", path.parse(file.name).name)

            const response = await fetch("/api/uploads/upload", {
                method: "POST",
                body: formData
            })

            if (!response.ok) {
                toast.error("Failed to upload images. Please try again.")
                return
            }

            const data = await response.json()
            newImageIds.push(data.id)
        }

        onImageIdsChange([...imageIds, ...newImageIds])
    }

    function handleImageDelete(imageId: string) {
        onImageIdsChange(imageIds.filter((id) => id !== imageId))
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="min-w-0 sm:min-w-xl">
                <DialogHeader>
                    <DialogTitle>{eventId ? "Edit Event" : "Create Event"}</DialogTitle>
                    <DialogDescription>
                        {eventId
                            ? "Make changes to the event and click save when you're done."
                            : "Fill out the form below to create a new event."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Category</Label>
                        <Select value={categoryId} onValueChange={onCategoryIdChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue
                                    placeholder={
                                        categories.length === 0 ? "No categories available" : "Select a category"
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((c) => (
                                    <SelectItem key={c.id} value={c.id}>
                                        {c.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label>Title</Label>
                        <Input
                            placeholder="Enter a title for the event."
                            value={title ?? ""}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className="font-mono text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Price (KR)</Label>
                        <Input
                            type="number"
                            placeholder="Enter the price for the event."
                            value={price ?? ""}
                            onChange={(e) => onPriceChange(e.target.value)}
                            className="font-mono text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Date</Label>
                        <Input
                            type="datetime-local"
                            placeholder="Enter the date for the event."
                            value={date ?? ""}
                            onChange={(e) => onDateChange(e.target.value)}
                            className="font-mono text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Location</Label>
                        <Input
                            placeholder="Enter the location for the event."
                            value={location ?? ""}
                            onChange={(e) => onLocationChange(e.target.value)}
                            className="font-mono text-xs"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Enter a description for the event."
                            value={description ?? ""}
                            onChange={(e) => onDescriptionChange(e.target.value)}
                            className="h-28 font-mono text-xs max-w-full wrap-anywhere"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Featured</Label>
                        <Switch onCheckedChange={onFeaturedChange} checked={featured} />
                    </div>

                    <div className="space-y-1.5">
                        <Label>Images</Label>
                        <p>Alt tag will be the file name!</p>
                        <Input type="file" onChange={handleImageUpload} accept="image/*" className="font-mono text-xs" />
                        <div className="grid grid-cols-2 gap-2">
                            {imageIds.map((id) => (
                                <div key={id} className="relative w-full h-40">
                                    <Image
                                        src={getFileUrl(id)}
                                        alt="Event image"
                                        width={200}
                                        height={200}
                                        className="object-cover object-top w-full h-full rounded"
                                    />
                                    <Button
                                        size="icon-sm"
                                        variant="destructive"
                                        className="absolute -top-2 -right-2"
                                        onClick={() => handleImageDelete(id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button onClick={onCreateClick} className="w-full">
                        {eventId ? "Save Changes" : "Create Event"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
