# stage 1
FROM node:alpine AS builder

RUN npm install -g pnpm

WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile


RUN pnpm demo:build

# stage 2
FROM node:22-alpine

# COPY config/angular.conf /etc/nginx/angular.conf
# COPY config/nginx.conf /etc/nginx/nginx.conf
# COPY config/security-headers.conf /etc/nginx/security-headers.conf

COPY --from=builder /app/dist/demo ./
ENV PORT=80
CMD node server/server.mjs

EXPOSE 80
