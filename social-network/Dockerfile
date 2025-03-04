# --- Stage 1: Build stage ---
FROM node:alpine as builder

LABEL author="Göran Rundberg"
LABEL description="Dockerfile for the Social Network Frontend"
LABEL version="0.1"

WORKDIR /social-network
# Copy project files including package.json and package-lock.json
COPY package*.json ./
# Install dependencies
RUN npm install
# Copy the rest of the application files
COPY . .
# Build the app
RUN npm run build

# --- Stage 2: Run stage ---
FROM nginx:alpine
WORKDIR /usr/share/nginx/html
# Copy only the built application from stage 1
COPY --from=builder /social-network/build/ .
# Copy nginx configuration
COPY backend.conf /etc/nginx/conf.d/backend.conf
COPY frontend.conf /etc/nginx/conf.d/default.conf
# Expose the default HTTP port
ENV ISDOCKER=true
EXPOSE 80
# Run the web service
CMD ["nginx", "-g", "daemon off;"]