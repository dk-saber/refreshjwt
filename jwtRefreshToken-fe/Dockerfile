# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable

# ---- Dependencies ----
FROM base AS deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --no-frozen-lockfile

# ---- Build ----
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm run build

# ---- Runtime ----
FROM node:22-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production
ENV NITRO_PORT=3000
ENV NITRO_HOST=0.0.0.0

COPY --from=build /app/.output ./.output

EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]
