FROM node:latest as builder
WORKDIR /usr/app
COPY . .
RUN pwd
RUN echo "VUE_APP_CLIENT_ID=$CLIENT_ID" >.env.development.local
RUN npm i  --legacy-peer-deps && npm run build 


FROM nginx:alpine

WORKDIR /etc/nginx
COPY ngnix.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/app/* /usr/share/nginx/html/
COPY 40-create-ghcred.sh /docker-entrypoint.d
EXPOSE 80
ENTRYPOINT [ "nginx" ]
CMD [ "-g", "daemon off;" ]
