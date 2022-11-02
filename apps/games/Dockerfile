FROM node:alpine AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=games --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:alpine AS installer
RUN apk update
WORKDIR /app

# First install the dependencies (as they change less often)
COPY .gitignore .gitignore
COPY --from=builder /app/out/json/ .
COPY --from=builder /app/out/yarn.lock ./yarn.lock
RUN yarn install

# Build the project
COPY --from=builder /app/out/full/ .
COPY turbo.json turbo.json
RUN yarn turbo run build --filter=games...


# TODO https://github.com/vercel/next.js/discussions/39432
FROM node:alpine AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=installer /app/apps/games/next.config.js ./apps/games/
COPY --from=installer /app/apps/games/package.json ./apps/games/

# COPY --from=installer ./node_modules ./
# Automatically leverage output traces to reduce image size 
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=installer --chown=nextjs:nodejs /app/apps/games/.next/standalone ./apps/games/
COPY --from=installer --chown=nextjs:nodejs /app/apps/games/.next/static ./apps/games/.next/static

ENV PORT=3005
EXPOSE 3005
CMD node apps/games/server.js
# CMD yarn turbo run dev --filter=games