FROM node:20-alpine AS build
WORKDIR /site
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build .vuepress/dist /usr/share/nginx/html
