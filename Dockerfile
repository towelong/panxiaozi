FROM node:22-alpine AS builder
LABEL "language"="nodejs"
LABEL "framework"="tanstack-start"

WORKDIR /app

RUN npm install -g pnpm@9

COPY . .

RUN pnpm install

RUN pnpm build

FROM node:22-alpine

WORKDIR /app

RUN npm install -g pnpm@9

COPY --from=builder /app/.zeabur/output ./

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server/index.mjs"]