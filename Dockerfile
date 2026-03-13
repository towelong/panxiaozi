FROM node:22-alpine AS builder

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

COPY pnpm-lock.yaml ./
COPY package.json ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build

FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

# 创建非 root 用户（安全）
RUN addgroup -g 1001 nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

WORKDIR /app

COPY --from=builder --chown=nextjs:nodejs /app/.output ./.output
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder /app/public ./public

COPY --from=builder /app/pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

USER nextjs

EXPOSE 3000

ENV NODE_ENV=production \
    PORT=3000

# 启动 SSR 服务器
CMD ["pnpm", "start"]