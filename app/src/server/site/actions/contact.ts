"use server"

import { prisma } from "@/server/database/prisma"
import { z } from "zod"

export async function submitContact(name: string, email: string, message: string) {
    const ContactSchema = z.object({
        name: z.string().nonempty("Name is required"),
        email: z.email("Invalid email address"),
        message: z.string().nonempty("Message is required")
    })

    const parsedData = ContactSchema.safeParse({ name, email, message })

    if (!parsedData.success) {
        const errorMessage = parsedData.error.issues[0]?.message || "Please fill out all fields correctly."
        throw new Error(errorMessage)
    }

    await prisma.contact.create({
        data: {
            name: parsedData.data.name,
            email: parsedData.data.email,
            message: parsedData.data.message
        }
    })
}
