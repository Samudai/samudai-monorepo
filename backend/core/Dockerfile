FROM golang:1.24-alpine AS builder
RUN apk add --no-cache git
WORKDIR /go/src/app
ENV GO111MODULE=on
COPY . .
RUN go build -o ./backend ./cmd/server

FROM golang:1.24-alpine
WORKDIR /go/src/app
ENV PORT=8080
EXPOSE 8080
COPY --from=builder /go/src/app/backend .
CMD ["./backend"]
