# Build context: repository root.
FROM nginx:1.30-alpine
COPY shared/nginx/static.conf /etc/nginx/conf.d/default.conf
COPY shared/public/ /usr/share/nginx/html/
COPY apps/static-html/site/ /usr/share/nginx/html/
# The host umask is 077; make the copied files readable by the nginx worker.
RUN chmod -R a+rX /usr/share/nginx/html
