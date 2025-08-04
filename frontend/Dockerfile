# syntax=docker/dockerfile:1

# Build stage
FROM node:20.9.0-alpine AS builder

WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:20.9.0-alpine AS production

WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy built application from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Install a simple static file server
RUN npm install -g serve

# Use production node environment
ENV NODE_ENV production

# Expose the port
EXPOSE 5173

# Serve the built files
CMD ["serve", "-s", "dist", "-l", "5173"]
