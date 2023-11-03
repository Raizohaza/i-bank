
FROM i-bank:nx-base AS builder

ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /home/node
COPY . .

# test
RUN npm install -g pnpm

RUN pnpm nx build api-gateway

FROM i-bank:nx-base

WORKDIR /home
COPY --from=builder /home/node ./
ENV NODE_ENV=$NODE_ENV

CMD ["node", "./dist/apps/api-gateway/main.js"]