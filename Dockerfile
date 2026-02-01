# stage 1
FROM node:24-slim AS builder

WORKDIR /app

RUN corepack enable

# Install dependencies
COPY pnpm-lock.yaml .
COPY pnpm-workspace.yaml .
COPY package.json .
# Copy project packages.json files
COPY apps/docs/package.json apps/docs/package.json
COPY apps/isolated/package.json apps/isolated/package.json
COPY apps/test-wrapper/package.json apps/test-wrapper/package.json
COPY packages/controls/package.json packages/controls/package.json
COPY packages/custom-types/package.json packages/custom-types/package.json
COPY packages/playwright/package.json packages/playwright/package.json
COPY packages/themes/package.json packages/themes/package.json

# COPY .npmrc .
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
