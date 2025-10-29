# -------- Build stage --------
FROM node:22-alpine AS builder

WORKDIR /app

# Enable Yarn
RUN corepack enable

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy source code
COPY . .

# Copy .env (optional, if you want environment variables baked in)
# COPY .env ./

# Build Next.js
RUN yarn build

# -------- Production image --------
FROM node:22-alpine

WORKDIR /app

# Enable Yarn
RUN corepack enable

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy built code
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Copy .env if you want env baked in
# COPY --from=builder /app/.env ./
COPY .env ./


# Expose frontend port
EXPOSE 3000

# Start Next.js
CMD ["yarn", "start"]
