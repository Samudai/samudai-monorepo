FROM golang:1.24-alpine as builder

WORKDIR /go/src/app

ENV GO111MODULE=on

# Install git
RUN apk add --no-cache git

COPY . .

RUN go build -o ./service-analytics .

FROM golang:1.24-alpine

WORKDIR /go/src/app

ENV PORT 8080
EXPOSE 8080

COPY --from=builder /go/src/app .

CMD [ "./service-analytics"]
