# Base image for development
FROM node:23.11.0 AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

RUN mkdir -p /app/eto_assets /app/logs
RUN chmod -R 775 /app/eto_assets /app/logs

EXPOSE 3000

# Development stage
FROM base AS development
CMD ["npm", "run", "dev"]

# Production stage
FROM base AS production
# Install curl for healthcheck
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*
CMD ["npm", "run", "prod"]