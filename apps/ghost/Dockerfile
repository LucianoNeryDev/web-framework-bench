# Ghost target. Build context is the repository root.
#   ghost  official Ghost image + the Field Notes theme, routes.yaml and the seed script
#   nginx  nginx in front of Ghost, serving shared/public/ itself
# Both are built and run by apps/ghost/compose.yaml.

FROM ghost:6.77.0-alpine AS ghost
COPY content/posts.json /opt/fieldnotes/posts.json
COPY apps/ghost/theme/ /opt/fieldnotes/theme/
COPY apps/ghost/tools/theme-data.mjs /opt/fieldnotes/tools/theme-data.mjs
RUN node /opt/fieldnotes/tools/theme-data.mjs /opt/fieldnotes/posts.json /opt/fieldnotes/theme
COPY apps/ghost/ghost/routes.yaml /opt/fieldnotes/routes.yaml
COPY apps/ghost/seed/seed.mjs /opt/fieldnotes/seed.mjs
COPY apps/ghost/ghost/entrypoint.sh /usr/local/bin/fieldnotes-entrypoint.sh
RUN chmod -R a+rX /opt/fieldnotes && chmod 755 /usr/local/bin/fieldnotes-entrypoint.sh
ENTRYPOINT ["fieldnotes-entrypoint.sh"]
CMD ["node", "current/index.js"]

FROM nginx:1.30-alpine AS nginx
RUN rm -f /etc/nginx/conf.d/default.conf
COPY shared/public/ /usr/share/nginx/html/
COPY apps/ghost/nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY apps/ghost/nginx/fieldnotes/ /etc/nginx/fieldnotes/
RUN chmod -R a+rX /usr/share/nginx/html /etc/nginx/templates /etc/nginx/fieldnotes
