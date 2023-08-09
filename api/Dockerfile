# Use an official Go runtime as a parent image
FROM golang:1.20.5-alpine

LABEL author="Viktor Thörnroos"
LABEL description="Dockerfile for the Social Network API"
LABEL version="0.1"

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

RUN apk update && apk add --no-cache gcc musl-dev
# Build the Go app
ENV CGO_ENABLED=1
ENV ISDOCKER=true
RUN go build -o main .

# Expose port 8080 for the API
EXPOSE 8080

# Link the logs directory to the container
VOLUME ["/app/logs"]

# Run the Go app when the container starts
CMD ["./main"]