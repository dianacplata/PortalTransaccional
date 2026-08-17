FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ── Desarrollo (hot-reload con Vite) ──────────────────────────────────────────
FROM base AS dev
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# ── Build de producción ───────────────────────────────────────────────────────
FROM base AS build
RUN npm ci
COPY . .
ARG VITE_API_URL
ARG VITE_BASE_FEE_CENTS=300000
ARG VITE_DELIVERY_FEE_CENTS=150000
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_BASE_FEE_CENTS=$VITE_BASE_FEE_CENTS
ENV VITE_DELIVERY_FEE_CENTS=$VITE_DELIVERY_FEE_CENTS
RUN npm run build

# ── Servido estático con nginx ────────────────────────────────────────────────
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
