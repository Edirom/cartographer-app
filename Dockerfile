# ---- 1) Base build stage ----
FROM node:20-alpine AS base
WORKDIR /app

# Install deps first (cache-friendly)
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then \
      npm ci --legacy-peer-deps; \
    else \
      npm install --legacy-peer-deps; \
    fi

# Bring in the full source (SPA + docs)
COPY . .

# ---- 2) Build frontend ----
FROM base AS build-app
RUN npm run build

# ---- 3) Build VuePress docs ----
# Uses the root script so all required deps/plugins are available.
FROM base AS build-docs
RUN npm run docs:build

# ---- 4) Runtime nginx ----
FROM nginx:alpine

# Default public path; can be overridden at runtime: -e VUE_APP_PUBLIC_PATH=/demo
ENV VUE_APP_PUBLIC_PATH="/"

# Startup script (injects vars and creates /<subpath> symlink)
COPY 40-create-ghcred.sh /docker-entrypoint.d/40-create-ghcred.sh
RUN chmod +x /docker-entrypoint.d/40-create-ghcred.sh

# Nginx server config
COPY ngnix.conf /etc/nginx/conf.d/default.conf

# Copy built SPA into the web root (replaces nginx welcome page)
COPY --from=build-app  /app/dist/                 /usr/share/nginx/html/

COPY --from=build-docs /app/docs/.vuepress/dist/  /usr/share/nginx/html/docs/

EXPOSE 80
# (nginx image already has a default CMD, optional:)
# CMD ["nginx", "-g", "daemon off;"]
