# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage (serve)
FROM node:18-alpine

WORKDIR /app

RUN npm install -g serve

# builder’dan sadece build klasörünü alıyoruz
COPY --from=builder /app/build ./build

EXPOSE 3002

CMD ["serve", "-s", "build", "-l", "3002"]
