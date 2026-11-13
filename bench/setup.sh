#!/usr/bin/env bash
# One-time harness setup: npm packages, Playwright Chromium, and the oha load generator binary.
set -euo pipefail
cd "$(dirname "$0")"
npm ci
npx playwright install chromium
mkdir -p bin
if [[ ! -x bin/oha ]] || ! bin/oha --version | grep -q 1.16.0; then
  curl -fsSL -o bin/oha https://github.com/hatoo/oha/releases/download/v1.16.0/oha-linux-amd64
  chmod 755 bin/oha
fi
bin/oha --version
