FROM node:20-bookworm AS builder

WORKDIR /app

COPY . .

RUN npm install -g pnpm @nestjs/cli

RUN npx playwright install --with-deps

RUN pnpm config set store-dir ~/pnpm

RUN pnpm install