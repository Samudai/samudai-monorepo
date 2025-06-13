FROM golang:1.18-alpine AS builder

RUN apk add --no-cache git

WORKDIR /go/src/app

ENV GO111MODULE=on

# Copy service directories with their go.mod files
COPY services/service-plugin/ services/service-plugin/
COPY services/service-discord/ services/service-discord/

WORKDIR /go/src/app/services/service-plugin

RUN go build -o ./service-plugin .

FROM golang:1.18-alpine

WORKDIR /go/src/app

ENV PORT=8080
EXPOSE 8080

COPY --from=builder /go/src/app/services/service-plugin/service-plugin .

CMD ["./service-plugin"]
