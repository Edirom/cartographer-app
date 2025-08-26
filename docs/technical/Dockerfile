# Stage 1: build VuePress site
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Build VuePress (from /docs)
RUN npm run docs:build

# Stage 2: serve
FROM nginx:alpine

COPY --from=builder /app/docs/.vuepress/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
