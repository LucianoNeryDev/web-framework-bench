# Build context: repository root.
#   docker build -f apps/sveltekit/Dockerfile --target static -t wfb/sveltekit:static .
#   docker build -f apps/sveltekit/Dockerfile --target server -t wfb/sveltekit:server .

# --- shared dependency layer ---------------------------------------------------------------------
FROM node:24-alpine AS base
WORKDIR /repo/apps/sveltekit
COPY apps/sveltekit/package.json apps/sveltekit/package-lock.json ./
RUN npm ci
COPY apps/sveltekit/ ./
# content/posts.json is imported relative to the app (../../content), exactly as in the repository.
COPY content/posts.json /repo/content/posts.json
# shared/public is copied into static/ at build time; it is never committed under apps/sveltekit.
COPY shared/public/ ./static/

# --- static: everything prerendered (adapter-static) ---------------------------------------------
FROM base AS build-static
ENV WFB_MODE=static
RUN npm run build

FROM nginx:1.29-alpine AS static
COPY shared/nginx/static.conf /etc/nginx/conf.d/default.conf
COPY shared/public/ /usr/share/nginx/html/
COPY --from=build-static /repo/apps/sveltekit/build/ /usr/share/nginx/html/
# The host umask is 077; make the copied files readable by the nginx worker.
RUN chmod -R a+rX /usr/share/nginx/html

# --- server: every page rendered per request (adapter-node) --------------------------------------
FROM base AS build-server
ENV WFB_MODE=server
RUN npm run build

FROM node:24-alpine AS server
ENV NODE_ENV=production PORT=8080 HOST=0.0.0.0
WORKDIR /app
COPY --from=build-server /repo/apps/sveltekit/build ./build
COPY --from=build-server /repo/apps/sveltekit/package.json ./package.json
RUN chmod -R a+rX /app
USER node
EXPOSE 8080
CMD ["node", "build"]
