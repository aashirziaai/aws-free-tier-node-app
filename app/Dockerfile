FROM node:20-alpine

RUN apk add --no-cache curl
RUN addgroup -S app && adduser -S app -G app
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .

ENV NODE_ENV=production
ENV PORT=3000

USER app
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --retries=3   CMD curl -fsS http://localhost:3000/health || exit 1

CMD ["npm", "start"]
