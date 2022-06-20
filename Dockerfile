FROM node:lts-gallium

ENV PORT=80
EXPOSE 80

WORKDIR /usr/src/app

COPY . .

RUN npm install -D
RUN npx prisma db pull
RUN npx prisma generate
RUN npm run build

EXPOSE 80

CMD ["node", "/usr/src/app/dist/main.js"]
