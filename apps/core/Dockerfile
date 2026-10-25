FROM node:24.22.1-bookworm-slim AS build

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/core/package.json apps/core/package.json

RUN npm install --global pnpm@11.10.0 --ignore-scripts \
  && pnpm install --frozen-lockfile

COPY tsconfig.base.json ./
COPY apps/core/prisma apps/core/prisma
COPY apps/core/LICENSE apps/core/LICENSE
COPY apps/core/tsconfig.build.json apps/core/tsconfig.build.json
COPY apps/core/src apps/core/src

RUN pnpm --filter @payfreo/core db:generate \
  && pnpm --filter @payfreo/core build

FROM node:24.22.1-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV XDG_CACHE_HOME=/tmp
WORKDIR /app/apps/core

COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/apps/core/node_modules ./node_modules
COPY --from=build /app/apps/core/dist ./dist
COPY --from=build /app/apps/core/prisma ./prisma
COPY --from=build /app/apps/core/LICENSE ./LICENSE
COPY --from=build /app/apps/core/package.json ./package.json

RUN mkdir -p /data && chown node:node /data

USER node
EXPOSE 3000

CMD ["sh", "-c", "./node_modules/.bin/prisma migrate deploy && node dist/main.js"]
