# Build context: repository root.
#   docker build -f apps/angular/Dockerfile --target static -t wfb/angular:static .
#   docker build -f apps/angular/Dockerfile --target server -t wfb/angular:server .

# The app is laid out as in the repository (apps/angular next to content/ and shared/), because
# tools/prepare.mjs and angular.json reach the shared files through ../../.
FROM node:26.13.0-slim AS deps
WORKDIR /repo/apps/angular
COPY apps/angular/package.json apps/angular/package-lock.json ./
RUN npm ci

FROM deps AS sources
WORKDIR /repo
COPY content/posts.json content/posts.json
COPY shared/public shared/public
COPY apps/angular/angular.json apps/angular/tsconfig.json apps/angular/tsconfig.app.json apps/angular/
COPY apps/angular/tools apps/angular/tools
COPY apps/angular/src apps/angular/src
WORKDIR /repo/apps/angular

FROM sources AS build-static
RUN npm run build:static

FROM sources AS build-server
RUN npm run build:server

# Static mode: every route prerendered (outputMode "static"), served by the shared nginx config.
FROM nginx:1.30-alpine AS static
COPY shared/nginx/static.conf /etc/nginx/conf.d/default.conf
COPY --from=build-static /repo/apps/angular/dist/angular/browser/ /usr/share/nginx/html/
# The host umask is 077; make the copied files readable by the nginx worker.
RUN chmod -R a+rX /usr/share/nginx/html

# Server mode: the generated Node server (Express + AngularNodeAppEngine), rendering every request.
FROM node:26.13.0-slim AS server
WORKDIR /app
COPY --from=build-server /repo/apps/angular/dist/angular/ ./dist/angular/
RUN chmod -R a+rX /app
ENV NODE_ENV=production PORT=8080 NG_ALLOWED_HOSTS=*
USER node
EXPOSE 8080
CMD ["node", "dist/angular/server/server.mjs"]
