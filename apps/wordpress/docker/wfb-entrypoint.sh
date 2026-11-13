#!/bin/sh
# Installs and seeds WordPress on every start (idempotently), then runs php-fpm.
# The healthcheck passes only once /tmp/wfb-ready exists, so `compose up --wait` returns with the content in place.
set -eu
rm -f /tmp/wfb-ready
cd /var/www/wordpress
export WP_CLI_ALLOW_ROOT=1

tries=0
until php -r '
  mysqli_report(MYSQLI_REPORT_OFF);
  $db = @mysqli_connect(getenv("WORDPRESS_DB_HOST") ?: "db", getenv("WORDPRESS_DB_USER") ?: "wordpress",
                        getenv("WORDPRESS_DB_PASSWORD") ?: "wordpress", getenv("WORDPRESS_DB_NAME") ?: "wordpress");
  exit($db ? 0 : 1);'; do
  tries=$((tries + 1))
  [ "$tries" -lt 120 ] || { echo "database not reachable" >&2; exit 1; }
  sleep 1
done

if ! wp core is-installed 2>/dev/null; then
  wp core install --url=https://bench.example --title="Field Notes" --admin_user=admin \
    --admin_password="$(head -c 24 /dev/urandom | base64)" --admin_email=ada@bench.example --skip-email
fi
wp eval-file /usr/src/wfb/seed.php /usr/src/wfb/posts.json

touch /tmp/wfb-ready
exec "$@"
