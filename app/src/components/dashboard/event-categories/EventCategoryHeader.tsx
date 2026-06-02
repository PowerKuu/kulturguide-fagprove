"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Loader2, Search } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function EventCategoryHeader({
    onCreateClick,
    isLoading,
}: {
    onCreateClick: () => void
    isLoading: boolean
}) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Event Categories</h2>
                    <p className="text-sm text-muted-foreground">Create, view and manage event categories</p>
                </div>

                <div className="flex gap-2">
                <Button onClick={onCreateClick} disabled={isLoading}>

                            <Plus className="mr-2 h-4 w-4" />
                            Create Event Category
                    </Button>
                </div>
            </div>
        </div>
    )
}
