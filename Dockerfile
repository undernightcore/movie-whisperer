FROM node:lts as build

WORKDIR /usr/local/app
COPY ./ /usr/local/app/
ENV NODE_ENV=development
RUN npm install
RUN npx prisma generate
RUN npm run build

FROM node:lts

WORKDIR /usr/local/app
COPY --from=build /usr/local/app/node_modules ./node_modules
COPY --from=build /usr/local/app/package*.json ./
COPY --from=build /usr/local/app/build ./build
COPY --from=build /usr/local/app/prisma ./prisma
ENV NODE_ENV=production
CMD npx prisma migrate deploy && node build/index.js