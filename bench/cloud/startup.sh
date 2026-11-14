#!/bin/bash
# GCE startup script for the benchmark VMs. Idempotent; role comes from instance metadata "wfb-role".
set -euo pipefail
[ -f /var/lib/wfb-ready ] && exit 0
export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y ca-certificates curl git jq
curl -fsSL https://get.docker.com | sh
ROLE=$(curl -fs -H "Metadata-Flavor: Google" http://metadata.google.internal/computeMetadata/v1/instance/attributes/wfb-role || echo target)
if [ "$ROLE" = "loadgen" ]; then
  curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
  apt-get install -y nodejs
fi
touch /var/lib/wfb-ready
