import { betterAuth, APIError } from "better-auth"
import { createAuthMiddleware } from "better-auth/api"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { prisma } from "@/server/database/prisma"
import { emailTemplates } from "@/server/mail/templates"

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),
    emailAndPassword: {
        enabled: true,
        async sendResetPassword(data: { user: { email: string }; url: string }) {
            const template = emailTemplates.resetPassword(data.url)
            console.log(`[Dev Mode] Sending password reset email to ${data.user.email} with URL: ${data.url}`)
        }
    },
    emailVerification: {
        sendOnSignUp: true,
        async sendVerificationEmail(data: { user: { email: string }; url: string }) {
            const template = emailTemplates.verifyEmail(data.url)
            console.log(`[Dev Mode] Sending verification email to ${data.user.email} with URL: ${data.url}`)
        }
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: "USER",
                input: false
            }
        }
    },
    hooks: {
        before: createAuthMiddleware(async (ctx: { path: string; body?: { password?: string } }) => {
            if (ctx.path === "/sign-up/email") {
                const password = ctx.body?.password
                if (!password || password.length < 8 || !/\d/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
                    throw new APIError("BAD_REQUEST", {
                        message: "Password must be at least 8 characters and include a number and a special character"
                    })
                }
            }
        })
    }
})
