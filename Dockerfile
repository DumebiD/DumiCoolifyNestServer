# FROM node:24-alpine AS development

# WORKDIR /app

# COPY package*.json ./

# RUN npm ci

# COPY . .

# RUN npm run build

# EXPOSE 3000

# CMD ["npm", "run", "start"]

FROM node:24-alpine AS base
WORKDIR /app
COPY package*.json ./

# dev: hot reload, all deps
FROM base AS development
RUN npm ci
COPY . .
CMD ["npm", "run", "start:dev"]

# build: compile TypeScript
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# prod: runtime deps and compiled output only
FROM node:24-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY --from=build /app/dist ./dist
USER node
EXPOSE 3000
CMD ["node", "dist/main"]