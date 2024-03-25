FROM apify/actor-node-playwright-chrome:20 AS builder

COPY . .

RUN chown -R node: .

USER node

RUN npm install -g pnpm

RUN pnpm setup

RUN pnpm i -g @nestjs/cli

WORKDIR /app

RUN pnpm i

# USER root
# RUN pnpm exec playwright install --with-deps
# USER node