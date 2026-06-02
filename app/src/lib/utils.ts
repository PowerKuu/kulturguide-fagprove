import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createHash } from "crypto"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function removeUndefinedValues<T extends Object>(obj: T): Partial<T> {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined)) as Partial<T>
}

export function formatPrice(priceGross: number, currency: string = "USD") {
    return `${priceGross.toFixed(2)} ${currency}`
}

export function absoluteUrl(path?: string): string {
    const BASE_URL = process.env.BASE_URL?.replace(/\/$/, "")

    if (!BASE_URL) {
        throw new Error("BASE_URL environment variable is not set")
    }

    if (!path) return BASE_URL
    return `${BASE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
}

export function validatePassword(password: string) {
    return {
        minLength: password.length >= 8,
        hasNumber: /\d/.test(password),
        hasSpecial: /[^a-zA-Z0-9]/.test(password)
    }
}

export function validateUrl(url: string): boolean {
    try {
        const parsed = new URL(url)
        return parsed.protocol === "http:" || parsed.protocol === "https:"
    } catch {
        return false
    }
}

export function parseTextfieldList(input: string): string[] {
    if (!input.trim()) return []

    const list = input
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)

    return list
}

export function randomShuffle<T>(array: T[]): T[] {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

export function randomDraw<T>(array: readonly T[]): T {
    const index = Math.floor(Math.random() * array.length)
    return array[index]
}

export function getFileUrl(id: string, options?: { width?: number; quality?: number }): string {
    const base = `/api/uploads/${id}`
    if (!options?.width && !options?.quality) return base
    const params = new URLSearchParams()
    if (options.width) {
        params.set("w", String(options.width))
        params.set("compressed", "true")
    }
    if (options.quality) params.set("q", String(options.quality))
    return `${base}?${params.toString()}`
}

export function nextImageLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
    return getFileUrl(src, { width, quality })
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
}

export function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export function capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
}

export function hash(str: string) {
    return createHash("sha256").update(str).digest("hex")
}

export function hashArray(arr: string[]) {
    const sorted = [...arr].sort()
    return hash(sorted.join(","))
}

export function escapeXml(str: string): string {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
}

export function bufferToFile(buffer: Buffer, name: string, type = "image/jpeg"): File {
    return new File([new Uint8Array(buffer)], name, { type })
}
