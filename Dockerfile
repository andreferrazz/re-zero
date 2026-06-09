FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG VITE_COUCHDB_URL
RUN npm run build

FROM node:24-alpine
WORKDIR /app
COPY --from=build /app/build ./build
COPY --from=build /app/package.json /app/package-lock.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["node", "build"]
