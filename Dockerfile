# stage 1
FROM node:alpine AS builder

RUN npm install -g pnpm

WORKDIR /app

# Install dependencies
COPY */package.json .
COPY pnpm-lock.yaml .
# COPY .npmrc .
COPY pnpm-workspace.yaml .
RUN pnpm install --frozen-lockfile

# Build the app
COPY . .
RUN pnpm docs:build

# stage 2
FROM node:24-alpine

# COPY config/angular.conf /etc/nginx/angular.conf
# COPY config/nginx.conf /etc/nginx/nginx.conf
# COPY config/security-headers.conf /etc/nginx/security-headers.conf

COPY --from=builder /app/apps/docs/dist ./
ENV PORT=80
CMD ["node", "server/server.mjs"]

EXPOSE 80
