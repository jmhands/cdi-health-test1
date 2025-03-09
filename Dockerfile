# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and config
COPY package*.json ./
COPY postcss.config.js ./
COPY tailwind.config.ts ./
COPY tsconfig.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine

# Install Python and smartmontools
RUN apk add --no-cache python3 smartmontools

# Create log directory
RUN mkdir -p /tmp/cdi/logs

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Copy the scan script and make it executable
COPY scripts/scan_smart.py /usr/local/bin/
RUN chmod +x /usr/local/bin/scan_smart.py

# Add a cron job to run the scan every hour
RUN echo "0 * * * * /usr/local/bin/scan_smart.py" > /etc/crontabs/root

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Start both the cron daemon and Next.js
CMD crond -b && npm run start

