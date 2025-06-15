FROM golang:1.24-alpine AS builder

RUN apk add --no-cache git

WORKDIR /go/src/app

ENV GO111MODULE=on

# Copy service directories with their go.mod files
COPY services/gateway-external/ services/gateway-external/
COPY services/service-discord/ services/service-discord/
COPY services/service-project/ services/service-project/
COPY services/service-dao/ services/service-dao/
COPY services/service-member/ services/service-member/
COPY services/service-point/ services/service-point/

WORKDIR /go/src/app/services/gateway-external

RUN go build -o ./gateway-external .

FROM golang:1.24-alpine

WORKDIR /go/src/app

ENV PORT=8080
EXPOSE 8080

COPY --from=builder /go/src/app/services/gateway-external/gateway-external .

CMD ["./gateway-external"]
