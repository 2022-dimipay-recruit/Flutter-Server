FROM node:latest

WORKDIR /usr/src/app

COPY . .

RUN npm install -D

RUN npm run build

EXPOSE 3000

CMD ["node", "/usr/src/app/dist/main.js"]