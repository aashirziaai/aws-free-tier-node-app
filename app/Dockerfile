# Lightweight + current LTS
FROM node:20-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production

# Create non-root user
RUN addgroup -g 1001 nodeapp && adduser -S -u 1001 -G nodeapp nodeapp

# Copy only manifests first for better caching
COPY package*.json ./

# If package-lock.json exists, use npm ci (faster, reproducible),
# otherwise fall back to npm install so the build doesn't fail
RUN if [ -f package-lock.json ]; then \
      npm ci --omit=dev; \
    else \
      npm install --omit=dev; \
    fi

# Copy the rest of the app
COPY server.js ./

EXPOSE 3000
USER nodeapp
CMD ["node", "server.js"]
