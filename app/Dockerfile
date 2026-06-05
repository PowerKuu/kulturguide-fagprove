FROM oven/bun:1 AS base
WORKDIR /app

# ── Dependencies ──────────────────────────────────────────────────────────────
FROM base AS deps
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# ── Builder ───────────────────────────────────────────────────────────────────
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN bunx prisma generate
RUN bun run build

# ── Runner ────────────────────────────────────────────────────────────────────
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app ./
COPY --from=builder /app/.next/static ./.next/standalone/.next/static
COPY --from=builder /app/.next/server/chunks/ ./.next/standalone/.next/server/chunks/
COPY --from=builder /app/public ./.next/standalone/public

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["sh", "-c", "bunx prisma migrate deploy && bun .next/standalone/server.js"]
