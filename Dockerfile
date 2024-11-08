FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

COPY .env ./

RUN npm run build

FROM node:18 AS production

WORKDIR /app

COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm install --production

COPY --from=build /app/dist /app/dist

CMD ["node", "dist/main"]