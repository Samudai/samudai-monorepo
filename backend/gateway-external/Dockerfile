# Build context is backend/ (not backend/gateway-external) because gateway-external
# reuses service-go's exported pkg/* types via `replace => ../service-go`, so the
# sibling module must be present at build time. backend/.dockerignore trims the
# context to just the two Go modules needed here.
FROM golang:1.26-alpine AS builder
RUN apk add --no-cache git
WORKDIR /src
ENV GO111MODULE=on
# Preserve the ../service-go relative path the replace directive expects.
COPY service-go/ ./service-go/
COPY gateway-external/ ./gateway-external/
WORKDIR /src/gateway-external
RUN go build -o ./gateway-external ./cmd/server

FROM golang:1.26-alpine
WORKDIR /go/src/app
ENV PORT=8080
EXPOSE 8080
COPY --from=builder /src/gateway-external/gateway-external .
CMD ["./gateway-external"]
