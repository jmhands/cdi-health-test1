FROM node:20-alpine

# Install smartmontools
RUN apk add --no-cache smartmontools

# Set up the application
WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Set environment variables
ENV PORT=3000
ENV NODE_ENV=production

# Run the application
CMD ["npm", "start"]

