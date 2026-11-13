#!/bin/sh
# Ghost reads its themes and routes.yaml from the content volume. Copy the theme and routes baked into this image
# into the volume on every start, so a rebuilt image never runs against a stale copy, then hand over to the
# official entrypoint (which fixes ownership and drops to the node user).
set -e
if [ "$1" = node ] && [ "$2" = current/index.js ]; then
  mkdir -p "$GHOST_CONTENT/themes" "$GHOST_CONTENT/settings"
  rm -rf "$GHOST_CONTENT/themes/fieldnotes"
  cp -R /opt/fieldnotes/theme "$GHOST_CONTENT/themes/fieldnotes"
  cp /opt/fieldnotes/routes.yaml "$GHOST_CONTENT/settings/routes.yaml"
fi
exec docker-entrypoint.sh "$@"
