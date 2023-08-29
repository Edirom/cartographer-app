FROM node:latest as builder
WORKDIR /usr/app
COPY . .
RUN pwd
RUN echo "VUE_APP_CLIENT_ID=$CLIENT_ID" >.env.development.local
RUN npm i --force && npm run build 


FROM nginx:alpine

WORKDIR /etc/nginx
COPY ./nginx.conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /usr/app/* /usr/share/nginx/html/
EXPOSE 80
ENTRYPOINT [ "nginx" ]
CMD [ "-g", "daemon off;" ]
