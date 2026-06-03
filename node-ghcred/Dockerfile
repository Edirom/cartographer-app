FROM node:lts-alpine
WORKDIR /usr/app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY server.js ./
EXPOSE 9999
CMD ["node", "server.js"]

