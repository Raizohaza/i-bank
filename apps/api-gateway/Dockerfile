
FROM i-bank:nx-base AS builder

ARG NODE_ENV
ARG BUILD_FLAG
WORKDIR /home/node
COPY . .

# test
RUN npm install -g pnpm

# RUN npx nx build api-gateway # co the do cai nx cho nay ko tuong thich
RUN pnpm nx build api-gateway

FROM i-bank:nx-base

WORKDIR /home
COPY --from=builder /home/node ./
ENV NODE_ENV=$NODE_ENV

CMD ["node", "./dist/apps/api-gateway/main.js"]