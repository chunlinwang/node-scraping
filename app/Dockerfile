FROM apify/actor-node-playwright-chrome:20 AS builder

USER root

RUN npm install -g pnpm @nestjs/cli


WORKDIR /app

COPY . .

RUN chown -R node: .

USER node

RUN pnpm install 

# USER root
# RUN pnpm exec playwright install --with-deps
# USER node