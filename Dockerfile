FROM node:20-alpine

# Install Python and smartmontools
RUN apk add --no-cache python3 smartmontools

# Create log directory
RUN mkdir -p /tmp/cdi/logs

WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy application code
COPY . .

# Copy the scan script and make it executable
COPY scripts/scan_smart.py /usr/local/bin/
RUN chmod +x /usr/local/bin/scan_smart.py

# Add a cron job to run the scan every hour
RUN echo "0 * * * * /usr/local/bin/scan_smart.py" > /etc/crontabs/root

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Start both the cron daemon and Next.js
CMD crond -b && npm run dev

