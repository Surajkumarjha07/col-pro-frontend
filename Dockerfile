FROM node:22-alpine

WORKDIR /app
COPY package*.json .

RUN ls -la
RUN npm install

COPY . .

CMD [ "npm", "start" ]
