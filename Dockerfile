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
RUN apk add --no-cache python3 py3-pip smartmontools

WORKDIR /app

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Create scripts directory and copy Python scripts
RUN mkdir -p /usr/local/bin
COPY scripts/scan_smart.py /usr/local/bin/
COPY scripts/devices.py /usr/local/lib/python3.*/site-packages/
RUN chmod +x /usr/local/bin/scan_smart.py

# Create log directory
RUN mkdir -p /tmp/cdi/logs

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo 'echo "Running initial drive scan..."' >> /start.sh && \
    echo '/usr/local/bin/scan_smart.py' >> /start.sh && \
    echo 'echo "Starting cron daemon..."' >> /start.sh && \
    echo 'crond -b' >> /start.sh && \
    echo 'echo "Starting Next.js..."' >> /start.sh && \
    echo 'exec npm run start' >> /start.sh && \
    chmod +x /start.sh

# Add cron job to run scan every hour
RUN echo "0 * * * * /usr/local/bin/scan_smart.py" > /etc/crontabs/root

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# Use exec form of CMD to handle signals properly
CMD ["/start.sh"]

