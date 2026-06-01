FROM node:lts-alpine
WORKDIR /usr/app
COPY package.json ./
RUN npm install --production
COPY server.js ./
EXPOSE 9999
CMD ["node", "server.js"]

