#!/bin/sh
# Picks the server config from WFB_CACHE before nginx starts (run by the image's /docker-entrypoint.sh).
set -eu
case "${WFB_CACHE:-off}" in
  off) cp /etc/nginx/wfb/server.conf /etc/nginx/conf.d/default.conf ;;
  on)  cp /etc/nginx/wfb/cached.conf /etc/nginx/conf.d/default.conf ;;
  *)   echo "WFB_CACHE must be 'on' or 'off', got '${WFB_CACHE}'" >&2; exit 1 ;;
esac
echo "wfb: WFB_CACHE=${WFB_CACHE:-off}"
