FROM node:22-alpine AS BUILD_IMAGE
RUN apk update && apk add bash git && rm -rf /var/cache/apk/*

WORKDIR /app

ARG GITHUB_TOKEN
ENV GITHUB_TOKEN=${GITHUB_TOKEN}

COPY . .

# install dependencies (--ignore-scripts: a transitive dep of @samudai/web3-sdk
# ships a broken husky prepare script; no first-party dep needs install scripts)
RUN npm install --ignore-scripts
RUN npm run build

FROM node:22-alpine

WORKDIR /app

ENV PORT 8080
EXPOSE 8080

# copy from build image
COPY --from=BUILD_IMAGE /app .

CMD ["npm", "start"]
