FROM node:22-alpine

WORKDIR /app
COPY package*.json .

RUN ls -la
RUN npm ci

COPY . .

CMD [ "npm", "start" ]
