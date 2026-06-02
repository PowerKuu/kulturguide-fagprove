import { headers as nextHeaders } from "next/headers"
import { auth } from "./auth"

export async function guard(customHeaders?: Headers) {
    const headers = customHeaders ?? (await nextHeaders())

    const session = await auth.api.getSession({ headers }).catch(() => null)

    if (!session) return false

    return session
}

export async function adminGuard(customHeaders?: Headers) {
    const session = await guard(customHeaders)

    if (!session || session.user.role !== "ADMIN") {
        return false
    }

    return session
}

export async function requireAdmin(customHeaders?: Headers) {
    const session = await adminGuard(customHeaders)
    if (!session) throw new Error("Unauthorized: admin access required")
    return session
}
