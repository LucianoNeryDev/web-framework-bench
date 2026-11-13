# Next.js (App Router) target. Build context: repository root.
#   docker build -f apps/next/Dockerfile --target static -t wfb/next:static .
#   docker build -f apps/next/Dockerfile --target server -t wfb/next:server .
FROM node:24.22.3-alpine3.23 AS source
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
COPY apps/next/package.json apps/next/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY apps/next/ ./
# Shared dataset and static files are copied in, never committed under apps/next.
COPY content/posts.json ./data/posts.json
COPY shared/public/ ./public/
# The host umask is 077: make the copied files readable (the server stage runs as `node`).
RUN chmod -R a+rX /app/app /app/components /app/lib /app/scripts /app/data /app/public

# ---- static: output "export", served by nginx ----
FROM source AS build-static
ENV WFB_MODE=static
RUN node scripts/prepare-mode.mjs static && npx next build

FROM nginx:1.29-alpine AS static
COPY shared/nginx/static.conf /etc/nginx/conf.d/default.conf
COPY shared/public/ /usr/share/nginx/html/
COPY --from=build-static /app/out/ /usr/share/nginx/html/
# The host umask is 077; make the copied files readable by the nginx worker.
RUN chmod -R a+rX /usr/share/nginx/html

# ---- server: output "standalone", run with `node server.js` ----
FROM source AS build-server
ENV WFB_MODE=server
RUN node scripts/prepare-mode.mjs server && npx next build

FROM node:24.22.3-alpine3.23 AS server
WORKDIR /app
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=8080 HOSTNAME=0.0.0.0
COPY --from=build-server /app/.next/standalone ./
COPY --from=build-server /app/.next/static ./.next/static
COPY --from=build-server /app/public ./public
# Everything here comes from the build stage (created inside Docker), so it is already world-readable.
USER node
EXPOSE 8080
CMD ["node", "server.js"]
