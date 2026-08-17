FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

FROM base AS dev
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm", "run", "start:dev"]

FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
