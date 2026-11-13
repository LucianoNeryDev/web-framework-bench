# Build context: repository root.
#   docker build -f apps/laravel/Dockerfile --target server -t wfb/laravel:server .
#   docker build -f apps/laravel/Dockerfile --target nginx  -t wfb/laravel-nginx:server .
#   docker build -f apps/laravel/Dockerfile --target server-octane -t wfb/laravel:octane .
# Run the FPM pair with: docker compose -f apps/laravel/compose.yaml up -d --build --wait

# Production Composer dependencies, with an authoritative classmap.
FROM composer:2.11.2 AS vendor
WORKDIR /app
COPY apps/laravel/composer.json apps/laravel/composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction --prefer-dist
COPY apps/laravel/ ./
RUN composer dump-autoload --no-dev --no-scripts --classmap-authoritative --no-interaction

# The application: code, a SQLite file seeded at build time, and the config/route/view/event caches.
FROM php:8.4-fpm-alpine AS server
RUN apk add --no-cache fcgi \
 && mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY apps/laravel/docker/php.ini $PHP_INI_DIR/conf.d/zz-wfb.ini
COPY apps/laravel/docker/php-fpm.conf /usr/local/etc/php-fpm.d/zz-wfb.conf
WORKDIR /var/www/html
COPY --from=vendor /app ./
COPY shared/public/ ./public/
COPY content/posts.json ./database/content/posts.json
# A throwaway key: nothing here is encrypted or signed (no cookies, no sessions).
ENV APP_ENV=production APP_DEBUG=false APP_URL=http://localhost:8080 LOG_CHANNEL=stderr LOG_LEVEL=warning \
    SESSION_DRIVER=array CACHE_STORE=array QUEUE_CONNECTION=sync \
    APP_KEY=base64:d2ViLWZyYW1ld29yay1iZW5jaC1sYXJhdmVsLWtleSE=
RUN php artisan package:discover --ansi \
 && touch database/database.sqlite \
 && php artisan migrate --seed --force --no-interaction \
 && php artisan optimize \
 && chown -R www-data:www-data storage bootstrap/cache database \
 && chmod -R a+rX app bootstrap config database public resources routes storage artisan composer.json
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=12 \
  CMD SCRIPT_NAME=/ping SCRIPT_FILENAME=/ping REQUEST_METHOD=GET cgi-fcgi -bind -connect 127.0.0.1:9000 | grep -q pong
EXPOSE 9000

# nginx in front of PHP-FPM, serving shared/public/ directly.
FROM nginx:1.30-alpine AS nginx
COPY apps/laravel/docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY shared/public/ /var/www/html/public/
RUN chmod -R a+rX /var/www/html /etc/nginx/conf.d
HEALTHCHECK --interval=5s --timeout=3s --start-period=3s --retries=12 \
  CMD wget -qO- http://127.0.0.1:8080/healthz | grep -q ok
EXPOSE 8080

# Stretch variant: Laravel Octane on FrankenPHP, one container serving everything on 8080.
# Dependencies come from composer.octane.json / composer.octane.lock (the same lock plus laravel/octane).
FROM composer:2.11.2 AS vendor-octane
WORKDIR /app
ENV COMPOSER=composer.octane.json
COPY apps/laravel/composer.octane.json apps/laravel/composer.octane.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --no-interaction --prefer-dist
COPY apps/laravel/ ./
RUN composer dump-autoload --no-dev --no-scripts --classmap-authoritative --no-interaction

FROM dunglas/frankenphp:1.13.5-php8.4-alpine AS server-octane
# Octane handles signals through ext-pcntl, which the FrankenPHP image does not ship.
RUN install-php-extensions pcntl
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini"
COPY apps/laravel/docker/php.ini $PHP_INI_DIR/conf.d/zz-wfb.ini
WORKDIR /app
COPY --from=vendor-octane /app ./
COPY shared/public/ ./public/
COPY content/posts.json ./database/content/posts.json
ENV APP_ENV=production APP_DEBUG=false APP_URL=http://localhost:8080 LOG_CHANNEL=stderr LOG_LEVEL=warning \
    SESSION_DRIVER=array CACHE_STORE=array QUEUE_CONNECTION=sync OCTANE_SERVER=frankenphp \
    APP_KEY=base64:d2ViLWZyYW1ld29yay1iZW5jaC1sYXJhdmVsLWtleSE=
RUN php artisan package:discover --ansi \
 && touch database/database.sqlite \
 && php artisan migrate --seed --force --no-interaction \
 && php artisan optimize \
 && chmod -R a+rX app bootstrap config database public resources routes storage artisan composer.json
HEALTHCHECK --interval=5s --timeout=3s --start-period=5s --retries=12 \
  CMD wget -qO- http://127.0.0.1:8080/healthz | grep -q ok
EXPOSE 8080
CMD ["php", "artisan", "octane:start", "--server=frankenphp", "--host=0.0.0.0", "--port=8080", "--admin-port=2019"]
