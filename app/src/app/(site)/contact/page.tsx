"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { submitContact } from "@/server/site/actions/contact"
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { z } from "zod"

export default function Contact() {
    const [name, setName] = useState("")
    const [nameError, setNameError] = useState<string | null>(null)
    const [email, setEmail] = useState("")
    const [emailError, setEmailError] = useState<string | null>(null)
    const [message, setMessage] = useState("")
    const [messageError, setMessageError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    async function submitForm() {
        setNameError(null)
        setEmailError(null)
        setMessageError(null)
        setSuccess(false)

        const ContactSchema = z.object({
            name: z.string().nonempty("Navn er påkrevd"),
            email: z.email("Ugyldig e-postadresse"),
            message: z.string().nonempty("Melding er påkrevd")
        })

        const parsedContactForm = ContactSchema.safeParse({ name, email, message })

        if (!parsedContactForm.success) {
            const issues = parsedContactForm.error.issues
            setNameError(issues.find((i) => i.path[0] === "name")?.message || null)
            setEmailError(issues.find((i) => i.path[0] === "email")?.message || null)
            setMessageError(issues.find((i) => i.path[0] === "message")?.message || null)

            toast.error("Fyll ut alle feltene riktig før du kan sende inn skjemaet.")
            return
        }

        await submitContact(name, email, message)

        setName("")
        setEmail("")
        setMessage("")
        setSuccess(true)
    }

    return (
        <div className="flex flex-col gap-12">
            <div className="max-w-2xl">
                <h1 className="text-4xl font-bold mb-4">Kontakt oss</h1>
                <p className="text-muted-foreground">
                    Har du spørsmål eller henvendelser? Fyll ut skjemaet under, så tar vi kontakt med deg så snart som
                    mulig.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
                <form
                    className="flex flex-col gap-2"
                    onSubmit={(e) => {
                        e.preventDefault()
                        submitForm()
                    }}
                >
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name" className="text-base">
                            Navn
                        </Label>
                        <Input
                            id="name"
                            className="h-12 text-base px-4"
                            placeholder="Ola Nordmann"
                            value={name}
                            aria-invalid={!!nameError}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <ErrorSlot message={nameError} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="email" className="text-base">
                            E-post
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            className="h-12 text-base px-4"
                            placeholder="ola.nordmann@example.com"
                            value={email}
                            aria-invalid={!!emailError}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <ErrorSlot message={emailError} />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label htmlFor="message" className="text-base">
                            Melding
                        </Label>
                        <Textarea
                            id="message"
                            className="min-h-40 text-base px-4 py-3"
                            placeholder="Hei!"
                            value={message}
                            aria-invalid={!!messageError}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <ErrorSlot message={messageError} />
                    </div>

                    <Button type="submit" size="lg" className="mt-2 w-full sm:w-auto">
                        Send inn
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <div className="min-h-5">
                        {success && (
                            <p className="flex items-center gap-2 text-sm text-green-600 dark:text-green-500">
                                <CheckCircle2 className="h-4 w-4 shrink-0" />
                                Takk! Meldingen din er sendt.
                            </p>
                        )}
                    </div>
                </form>

                <div className="order-first flex items-center lg:order-last">
                    <img
                        src="/images/contact.webp"
                        alt="Kontaktillustrasjon"
                        className="h-full max-h-150 min-h-80 w-full rounded-xl object-cover"
                    />
                </div>
            </div>
        </div>
    )
}

function ErrorSlot({ message }: { message: string | null }) {
    return (
        <div className="flex min-h-5 items-center gap-2 text-sm text-destructive">
            {message && (
                <>
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{message}</span>
                </>
            )}
        </div>
    )
}
