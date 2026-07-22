# ---- 1) Base build stage ----
FROM node:24-alpine AS base
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

# ---- 2) Build frontend (SPA) ----
FROM base AS build-app

ENV VUE_APP_CLIENT_ID=__GH_CLIENT_ID__
ENV VUE_APP_CALL_BACK=__GH_CALLBACK_URL__
RUN npm run build

# ---- 3) Build VuePress docs ----
FROM base AS build-docs
RUN npm run docs:build

# ---- 4) Runtime: Nginx ----
FROM nginx:alpine

# Default public path; can be overridden at runtime
ENV VUE_APP_PUBLIC_PATH=""
# GitHub OAuth credentials — injected at runtime via 40-create-ghcred.sh
ENV VUE_APP_CLIENT_ID=""
ENV VUE_APP_CALL_BACK=""

# Copy final single-file nginx.conf
COPY nginx.conf /etc/nginx/nginx.conf

# Add startup script to inject runtime config and symlink
COPY 40-create-ghcred.sh /docker-entrypoint.d/40-create-ghcred.sh
RUN chmod +x /docker-entrypoint.d/40-create-ghcred.sh

# Copy built files into container
COPY --from=build-app  /app/dist/                 /usr/share/nginx/html/
COPY --from=build-docs /app/docs/.vuepress/dist/  /usr/share/nginx/html/docs/

EXPOSE 80

