FROM node:latest as builder
WORKDIR /usr/app
COPY . .
#RUN echo "VUE_APP_CLIENT_ID=$CLIENT_ID" >.env.development.local
RUN npm i  --legacy-peer-deps && npm run build 


FROM nginx:alpine

WORKDIR /etc/nginx
COPY 40-create-ghcred.sh /docker-entrypoint.d
COPY ngnix.conf /etc/nginx/nginx.d/default.conf
COPY --from=builder /usr/app/dist/ /usr/share/nginx/html/
