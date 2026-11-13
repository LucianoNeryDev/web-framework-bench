# Build context: repository root.
#   docker build -f apps/qwik/Dockerfile --target static -t wfb/qwik:static .
#   docker build -f apps/qwik/Dockerfile --target server -t wfb/qwik:server .

# --- shared dependency layer ---------------------------------------------------------------------
FROM node:24-alpine AS base
WORKDIR /repo/apps/qwik
COPY apps/qwik/package.json apps/qwik/package-lock.json ./
RUN npm ci
COPY apps/qwik/ ./
# content/posts.json is imported relative to the app (../../content), exactly as in the repository.
COPY content/posts.json /repo/content/posts.json
# shared/public is copied into public/ at build time; it is never committed under apps/qwik.
COPY shared/public/ ./public/
# The host umask is 077: make the copied host files readable. node_modules is built here and is already
# readable; re-chmodding it would copy every file up into a new layer.
RUN chmod -R a+rX /repo/content /repo/apps/qwik/src /repo/apps/qwik/public /repo/apps/qwik/adapters \
    && chmod a+rX /repo /repo/apps /repo/apps/qwik && chmod a+r /repo/apps/qwik/*.*

# --- static: every route prerendered by the Qwik City static adapter ----------------------------
FROM base AS build-static
RUN npm run build:static

FROM nginx:1.29-alpine AS static
COPY shared/nginx/static.conf /etc/nginx/conf.d/default.conf
COPY shared/public/ /usr/share/nginx/html/
COPY --from=build-static /repo/apps/qwik/dist/ /usr/share/nginx/html/
# The host umask is 077; make the copied files readable by the nginx worker.
RUN chmod -R a+rX /usr/share/nginx/html

# --- server: every page rendered per request (Express adapter, generated server entry) ----------
FROM base AS build-server
RUN npm run build:server

FROM node:24-alpine AS server
ENV NODE_ENV=production PORT=8080
WORKDIR /app
# The generated server entry bundles Qwik itself; only express and undici stay external.
COPY apps/qwik/package.json apps/qwik/package-lock.json ./
RUN npm ci --omit=dev
COPY --from=build-server /repo/apps/qwik/server ./server
COPY --from=build-server /repo/apps/qwik/dist ./dist
RUN chmod -R a+rX /app/dist /app/server
USER node
EXPOSE 8080
CMD ["node", "server/entry.express"]
