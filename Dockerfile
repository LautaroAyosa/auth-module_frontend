# --- Stage 1: Build ---
FROM node:20-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .

# Pass the API URL at build time
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# --- Stage 2: Runtime ---
FROM node:20-slim AS runner
WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next && chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
