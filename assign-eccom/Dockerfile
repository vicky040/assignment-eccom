# Use official Node.js LTS image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files from assign-eccom folder
COPY assign-eccom/package.json assign-eccom/package-lock.json* assign-eccom/pnpm-lock.yaml* assign-eccom/yarn.lock* ./
RUN npm install --force

# Copy all source files
COPY assign-eccom/. .

# Build Next.js app
RUN npm run build

# Production image
FROM node:20-alpine AS runner

WORKDIR /app

# Copy necessary build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.ts ./next.config.ts

ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
