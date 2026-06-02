"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EventCategory } from "@/prisma/client"
import { Input } from "@/components/ui/input"

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

    onCreateClick: () => void
    error?: string
}) {
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{eventId ? "Edit Event" : "Create Event"}</DialogTitle>
                    <DialogDescription>
                        {eventId ? "Make changes to the event and click save when you're done." : "Fill out the form below to create a new event."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>
                            Category
                        </Label>
                        <Select value={categoryId} onValueChange={onCategoryIdChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={
                                    categories.length === 0 ? "No categories available" : "Select a category"
                                } />
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
                        <Label>Price</Label>
                        <Input
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

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button onClick={onCreateClick} className="w-full">
                       {eventId ? "Save Changes" : "Create Event"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
