# ── Stage 1: build ──────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build:prod

# ── Stage 2: serve ──────────────────────────
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html

RUN printf 'server {\nlisten 80;\nroot /usr/share/nginx/html;\nindex index.html;\nlocation / { try_files $uri $uri/ /index.html; }\n}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
