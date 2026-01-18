# ---------- Build stage ----------
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---------- Run stage ----------
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

RUN npm i -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 8080

CMD sh -c "serve -s dist -l ${PORT}"
