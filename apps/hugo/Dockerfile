# Build context: repository root. docker build -f apps/hugo/Dockerfile --target static -t wfb/hugo:static .
FROM ghcr.io/gohugoio/hugo:v0.169.0 AS build
USER root
WORKDIR /src
COPY apps/hugo/ ./
# Shared inputs are copied in at build time, never committed under apps/hugo:
#   posts as the Hugo `blog` section, posts.json as a data file, shared/public as static/.
COPY content/posts/ content/blog/
COPY content/posts.json data/posts.json
COPY shared/public/ static/
RUN hugo --environment production --gc

FROM nginx:1.29-alpine AS static
COPY shared/nginx/static.conf /etc/nginx/conf.d/default.conf
COPY --from=build /src/public/ /usr/share/nginx/html/
# The host umask is 077; make the copied files readable by the nginx worker.
RUN chmod -R a+rX /usr/share/nginx/html
