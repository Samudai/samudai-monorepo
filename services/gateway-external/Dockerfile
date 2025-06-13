FROM golang:1.18-alpine AS builder

WORKDIR /go/src/app

ENV GO111MODULE=on

COPY services/gateway-external/ /go/src/app/
COPY services/service-discord/ /go/src/app/../service-discord/
COPY services/service-project/ /go/src/app/../service-project/
COPY services/service-dao/ /go/src/app/../service-dao/
COPY services/service-member/ /go/src/app/../service-member/

WORKDIR /go/src/app

RUN go build -o ./gateway-external .

FROM golang:1.18-alpine

WORKDIR /go/src/app

ENV PORT 8080
EXPOSE 8080

COPY --from=builder /go/src/app/gateway-external .

CMD ["./gateway-external"]
