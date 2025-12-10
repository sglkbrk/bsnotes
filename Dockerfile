# ---------- 1) Build Stage ----------
FROM node:18-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY . .
RUN npm run build


# ---------- 2) Production Stage ----------
FROM node:18-alpine

WORKDIR /app

# Global serve yükle (sadece prod)
RUN npm install -g serve

# Sadece build çıktısını al
COPY --from=builder /app/build ./build

# Güvenlik: container sadece localhost’u dinler
ENV HOST=127.0.0.1
ENV PORT=3002

EXPOSE 3002

CMD ["serve", "-s", "build", "-l", "3002", "--no-clipboard"]
