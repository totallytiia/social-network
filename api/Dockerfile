# Build stage
FROM golang:1.21-alpine3.18 AS build

LABEL author="Viktor Thörnroos & Göran Rundberg"
LABEL description="Dockerfile for the Social Network API Backend"
LABEL version="0.1"

RUN apk update && apk add --no-cache gcc musl-dev

WORKDIR /app
ENV CGO_ENABLED=1
ENV ISDOCKER=true

COPY . .

RUN go build -o /main .

# Final stage
FROM alpine:3.18

COPY --from=build /main /
COPY /db /db
ENV ISDOCKER=true


CMD ["/main"]