# Build context: repository root.
#   docker build -f apps/react-router/Dockerfile --target static -t wfb/react-router:static .
#   docker build -f apps/react-router/Dockerfile --target server -t wfb/react-router:server .

FROM node:24.22.3-alpine AS deps
WORKDIR /app
COPY apps/react-router/package.json apps/react-router/package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM deps AS source
COPY apps/react-router/react-router.config.ts apps/react-router/vite.config.ts apps/react-router/tsconfig.json ./
COPY apps/react-router/app/ app/
# Shared files are copied in, not committed: the dataset and the public assets.
COPY content/posts.json app/data/posts.json
COPY shared/public/ public/
RUN chmod -R a+rX /app/app /app/public

FROM source AS build-static
ENV WFB_MODE=static
RUN npm run build && chmod -R a+rX /app/build

FROM source AS build-server
ENV WFB_MODE=server
RUN npm run build && chmod -R a+rX /app/build

FROM nginx:1.30-alpine AS static
COPY shared/nginx/static.conf /etc/nginx/conf.d/default.conf
COPY --from=build-static /app/build/client/ /usr/share/nginx/html/
# static.conf serves error_page 404 /404.html: React Router pre-renders /404 as 404/index.html, so
# copy it to the flat file nginx expects. app.js (vanilla island) and the SPA fallback are not used.
RUN cd /usr/share/nginx/html && cp 404/index.html 404.html && rm -rf app.js __spa-fallback.html \
    && chmod -R a+rX /usr/share/nginx/html

FROM node:24.22.3-alpine AS server
WORKDIR /app
ENV NODE_ENV=production PORT=8080
COPY apps/react-router/package.json apps/react-router/package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund
COPY --from=build-server /app/build ./build
RUN chmod -R a+rX /app
USER node
EXPOSE 8080
CMD ["./node_modules/.bin/react-router-serve", "./build/server/index.js"]
