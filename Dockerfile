FROM node:lts-gallium

ENV PORT=80
EXPOSE 80

WORKDIR /usr/src/app

COPY . .

RUN npm install -D

RUN npm run build

EXPOSE 3000

CMD ["node", "/usr/src/app/dist/main.js"]
