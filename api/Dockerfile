# Use an official Go runtime as a parent image
FROM golang:1.21-alpine3.18

LABEL author="Viktor Thörnroos & Göran Rundberg"
LABEL description="Dockerfile for the Social Network API Backend"
LABEL version="0.1"

# Install dependencies
RUN apk update && apk add --no-cache gcc musl-dev
# Set the working directory to /app
WORKDIR /app

#Some environmentals
ENV CGO_ENABLED=1
ENV ISDOCKER=true

# Copy the current directory contents into the container at /app
COPY . .

# Build the Go app
RUN go build -o /main .

# Run the app
ENTRYPOINT [ "/main" ]
