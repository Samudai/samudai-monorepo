FROM golang:1.18-alpine as builder

WORKDIR /go/src/app

ENV GO111MODULE=on

COPY . .

RUN go build -o ./service-forms .


FROM golang:1.18-alpine

WORKDIR /go/src/app

ENV PORT 8080
EXPOSE 8080

COPY --from=builder /go/src/app .

CMD [ "./service-forms"]
