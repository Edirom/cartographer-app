# ---- 1) Base build stage ----
FROM node:20-alpine AS base
WORKDIR /app

# Install deps first (better cache)
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

COPY . .

# ---- 2) Build frontend ----
FROM base AS build-app
RUN npm run build

# ---- 3) Build VuePress docs ----
FROM base AS build-docs
RUN npm run docs:build

# ---- 4) Runtime nginx ----
FROM nginx:alpine

# Create startup script for injecting CLIENT_ID/SECRET into config
COPY 40-create-ghcred.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/40-create-ghcred.sh

# Copy built assets
COPY --from=build-app  /app/dist/                /usr/share/nginx/html/
COPY --from=build-docs /app/docs/.vuepress/dist /usr/share/nginx/docs/

# Copy external nginx config (you maintain this in repo)
COPY docker-nginx.conf/docker-nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8082
CMD ["nginx", "-g", "daemon off;"]
