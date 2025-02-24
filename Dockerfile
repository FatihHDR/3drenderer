# Use official Node.js 18 image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies globally with logging
RUN npm install -g http-server && \
    npm install && \
    npm list -g http-server && \
    npm cache clean --force && \
    apk add --no-cache curl


# Copy application files
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:3000 || exit 1

# Start application
CMD ["http-server", "-p", "3000"]
