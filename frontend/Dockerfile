FROM node:18 AS BUILD_IMAGE

WORKDIR /app

ARG NODE_ENV

COPY ./ .

# install dependencies
RUN npm install --force
RUN rm -f .npmrc

RUN npm run build:$NODE_ENV

FROM nginx:stable-alpine

COPY --from=BUILD_IMAGE /app/build /usr/share/nginx/html
COPY --from=BUILD_IMAGE /app/nginx/ /etc/nginx/conf.d/
