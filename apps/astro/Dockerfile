# Build context: repository root.
#   docker build -f apps/astro/Dockerfile --target static -t wfb/astro:static .
#   docker build -f apps/astro/Dockerfile --target server -t wfb/astro:server .

FROM node:26-slim AS deps
ENV ASTRO_TELEMETRY_DISABLED=1 NODE_ENV=development
WORKDIR /app
COPY apps/astro/package.json apps/astro/package-lock.json ./
RUN npm ci

FROM deps AS source
COPY apps/astro/ ./
# Shared files are copied in, never committed twice.
COPY content/posts.json src/data/posts.json
COPY shared/public/ public/
# Astro serves its own pages; the vanilla island and the static-target app.js are not used.
RUN rm -f public/app.js
# The host umask is 077: make the copied files readable (not node_modules: chmod would copy it all up a layer).
RUN chmod -R a+rX public src *.json *.mjs

FROM source AS build-static
ENV WFB_MODE=static
RUN npx astro build

FROM source AS build-server
ENV WFB_MODE=server
RUN npx astro build

FROM nginx:1.30-alpine AS static
COPY shared/nginx/static.conf /etc/nginx/conf.d/default.conf
COPY --from=build-static /app/dist/ /usr/share/nginx/html/
RUN chmod -R a+rX /usr/share/nginx/html

FROM node:26-slim AS server
ENV NODE_ENV=production ASTRO_TELEMETRY_DISABLED=1 HOST=0.0.0.0 PORT=8080
WORKDIR /app
COPY apps/astro/package.json apps/astro/package-lock.json ./
RUN chmod a+r package.json package-lock.json && npm ci --omit=dev
COPY --from=build-server /app/dist/ ./dist/
# dist holds copies of shared/public, which came from the host with umask 077.
RUN chmod -R a+rX /app/dist
USER node
EXPOSE 8080
CMD ["node", "./dist/server/entry.mjs"]
