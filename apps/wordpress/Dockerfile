# Build context: repository root.
#   docker build -f apps/wordpress/Dockerfile --target wordpress .   PHP-FPM with WordPress, theme, mu-plugin, WP-CLI
#   docker build -f apps/wordpress/Dockerfile --target nginx .       nginx with the same document root and shared/public
# Normally built through apps/wordpress/compose.yaml.

ARG WORDPRESS_IMAGE=wordpress:7.1.4-php8.5-fpm-alpine

# WordPress core without the bundled themes and plugins, and without configuration. Shared by both images; the
# theme and mu-plugin are copied last in each image so a theme change rebuilds only small layers.
FROM ${WORDPRESS_IMAGE} AS docroot
RUN cp -a /usr/src/wordpress /var/www/wordpress \
 && rm -rf /var/www/wordpress/wp-content/themes/twenty* /var/www/wordpress/wp-content/plugins/akismet \
           /var/www/wordpress/wp-content/plugins/hello.php /var/www/wordpress/wp-config-docker.php

FROM ${WORDPRESS_IMAGE} AS wordpress
ARG WP_CLI_VERSION=2.12.0
ARG WP_CLI_SHA512=be928f6b8ca1e8dfb9d2f4b75a13aa4aee0896f8a9a0a1c45cd5d2c98605e6172e6d014dda2e27f88c98befc16c040cbb2bd1bfa121510ea5cdf5f6a30fe8832
RUN curl -fsSL -o /usr/local/bin/wp "https://github.com/wp-cli/wp-cli/releases/download/v${WP_CLI_VERSION}/wp-cli-${WP_CLI_VERSION}.phar" \
 && echo "${WP_CLI_SHA512}  /usr/local/bin/wp" | sha512sum -c - \
 && chmod 755 /usr/local/bin/wp
COPY --from=docroot /var/www/wordpress /var/www/wordpress
COPY apps/wordpress/wp-config.php /var/www/wordpress/wp-config.php
COPY content/posts.json apps/wordpress/docker/seed.php /usr/src/wfb/
COPY apps/wordpress/docker/wfb-entrypoint.sh /usr/local/bin/wfb-entrypoint.sh
COPY apps/wordpress/wp-content/ /var/www/wordpress/wp-content/
RUN php -r 'foreach (["AUTH_KEY","SECURE_AUTH_KEY","LOGGED_IN_KEY","NONCE_KEY","AUTH_SALT","SECURE_AUTH_SALT","LOGGED_IN_SALT","NONCE_SALT"] as $k) printf("define(%s, %s);\n", var_export($k, true), var_export(bin2hex(random_bytes(32)), true));' \
      | sed '1i <?php' > /var/www/wordpress/wp-salts.php \
 && chmod a+r /var/www/wordpress/wp-config.php /var/www/wordpress/wp-salts.php \
 && chmod -R a+rX /usr/src/wfb /var/www/wordpress/wp-content \
 && chmod 755 /usr/local/bin/wfb-entrypoint.sh \
 && printf 'expose_php = Off\n' > /usr/local/etc/php/conf.d/zz-wfb.ini
WORKDIR /var/www/wordpress
ENTRYPOINT ["wfb-entrypoint.sh"]
CMD ["php-fpm"]

FROM nginx:1.30-alpine AS nginx
COPY --from=docroot /var/www/wordpress /var/www/wordpress
COPY apps/wordpress/docker/nginx/server.conf apps/wordpress/docker/nginx/cached.conf /etc/nginx/wfb/
COPY apps/wordpress/docker/nginx/05-wfb-cache.sh /docker-entrypoint.d/05-wfb-cache.sh
COPY shared/public/ /var/www/wordpress/
COPY apps/wordpress/wp-content/ /var/www/wordpress/wp-content/
RUN cd /var/www/wordpress && chmod a+rX . && chmod -R a+rX /etc/nginx/wfb wp-content style.css app.js favicon.svg images \
 && chmod 755 /docker-entrypoint.d/05-wfb-cache.sh
