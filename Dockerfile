FROM node:18.12.1-bullseye as builder
WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

FROM node:18.12.1-bullseye
WORKDIR /app

COPY --from=builder /app/dist /dist
COPY --from=builder /app/node_modules /node_modules
COPY --from=builder /app/package.json /package.json
COPY --from=builder /app/private.pem /private.pem
COPY --from=builder /app/public.pem /public.pem

CMD ["npm", "run", "start:dist"]