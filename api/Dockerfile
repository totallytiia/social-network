# Use an official Go runtime as a parent image
FROM golang:1.20.5-alpine as builderBOB

LABEL author="Viktor Thörnroos"
LABEL description="Dockerfile for the Social Network API"
LABEL version="0.1"

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . .
RUN apk update && apk add --no-cache gcc musl-dev
# Build the Go app
ENV CGO_ENABLED=1
ENV ISDOCKER=true

RUN go build -o /main .

# Run the app
FROM alpine:3.14
COPY --from=builderBOB /main /main
COPY ./db /db
ENTRYPOINT [ "/main" ]
