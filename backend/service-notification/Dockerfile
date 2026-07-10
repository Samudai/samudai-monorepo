FROM node:22-alpine AS build_image
RUN apk update && apk add bash git && rm -rf /var/cache/apk/*

WORKDIR /app

COPY . .

RUN npm install --ignore-scripts
RUN npm run build

FROM node:22-alpine

WORKDIR /app

ENV PORT 8080
EXPOSE 8080

# copy from build image
COPY --from=build_image /app .

CMD ["npm", "start"]
