# Build context: repository root.
#   docker build -f apps/nuxt/Dockerfile --target static -t wfb/nuxt:static .
#   docker build -f apps/nuxt/Dockerfile --target server -t wfb/nuxt:server .
# The layout under /repo mirrors the repository so nuxt.config.ts and server/utils/data.ts find ../../content/posts.json.

FROM node:26.13.0-slim AS deps
WORKDIR /repo/apps/nuxt
COPY apps/nuxt/package.json apps/nuxt/package-lock.json ./
RUN npm ci --no-audit --no-fund

FROM deps AS source
COPY content/posts.json /repo/content/posts.json
COPY apps/nuxt/nuxt.config.ts ./
COPY apps/nuxt/app ./app
COPY apps/nuxt/server ./server
# The shared files are copied in at build time, never committed under apps/nuxt/public.
COPY shared/public/ ./public/
# The host umask is 077: make every copied file readable.
RUN chmod -R a+rX /repo/content /repo/apps/nuxt/app /repo/apps/nuxt/server /repo/apps/nuxt/public /repo/apps/nuxt/nuxt.config.ts

FROM source AS build-static
RUN npm run generate

FROM source AS build-server
RUN npm run build

FROM nginx:1.30-alpine AS static
COPY shared/nginx/static.conf /etc/nginx/conf.d/default.conf
COPY shared/public/ /usr/share/nginx/html/
COPY --from=build-static /repo/apps/nuxt/.output/public/ /usr/share/nginx/html/
RUN chmod -R a+rX /usr/share/nginx/html /etc/nginx/conf.d

FROM node:26.13.0-slim AS server
ENV NODE_ENV=production HOST=0.0.0.0 PORT=8080
WORKDIR /app
COPY --from=build-server /repo/apps/nuxt/.output ./.output
RUN chmod -R a+rX /app
USER node
EXPOSE 8080
CMD ["node", ".output/server/index.mjs"]
