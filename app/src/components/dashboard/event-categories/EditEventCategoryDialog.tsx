"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EventCategory } from "@/prisma/client"
import { Input } from "@/components/ui/input"

export function EditEventCategoryDialog({
    eventCategoryId,

    open,
    onOpenChange,


    name,
    onNameChange,

    onCreateClick,
    error
}: {
    eventCategoryId?: string

    open: boolean
    onOpenChange: (open: boolean) => void

    name?: string
    onNameChange: (value: string) => void

    onCreateClick: () => void
    error?: string
}) {
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{eventCategoryId ? "Edit Event Category" : "Create Event Category"}</DialogTitle>
                    <DialogDescription>
                        {eventCategoryId ? "Make changes to the event category and click save when you're done." : "Fill out the form below to create a new event category."}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <Label>Name</Label>
                        <Input
                            placeholder="Enter a name for the event category."
                            value={name ?? ""}
                            onChange={(e) => onNameChange(e.target.value)}
                            className="font-mono text-xs"
                        />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button onClick={onCreateClick} className="w-full">
                       {eventCategoryId ? "Save Changes" : "Create Event Category"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
