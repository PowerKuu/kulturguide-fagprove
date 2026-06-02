import { z } from "zod"
const EnvSchema = z.object({
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.string().min(1),
    BASE_URL: z.string().min(1),
    DATABASE_URL: z.string().min(1)
})

const parsed = EnvSchema.safeParse(process.env)
if (!parsed.success) {
    const lines = parsed.error.issues.map((i) => `  • ${i.path.join(".")}: ${i.message}`)
    throw new Error(`Invalid environment configuration:\n${lines.join("\n")}`)
}

export const env = parsed.data
export type Env = typeof env
