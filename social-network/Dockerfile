# --- Stage 1: Build stage ---
FROM node:alpine as builder

LABEL author="Göran Rundberg"
LABEL description="Dockerfile for the Social Network Frontend"
LABEL version="0.1"

WORKDIR /social-network
# Copy project files including package.json and package-lock.json
COPY . .
# Install dependencies and build the app
RUN npm ci --force && npm run build

# --- Stage 2: Run stage ---
FROM node:alpine
WORKDIR /app
# Copy only the built application from stage 1
COPY --from=builder /social-network/ ./
# Expose port
EXPOSE 3000
# Run the web service
ENTRYPOINT ["npm", "run", "start"]