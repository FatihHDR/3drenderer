FROM node:14

WORKDIR /usr/src/app

COPY . .

RUN ls -la /usr/src/app

RUN npm install

EXPOSE 80

CMD ["npm", "start"]