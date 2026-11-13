#!/usr/bin/env bash
# Full measurement run. Phase by phase across all targets, so every target meets the same machine state.
# Usage: bench/run-all.sh [target ...]   (detach it: setsid nohup bench/run-all.sh > /dev/null 2>&1 &)
set -uo pipefail
cd "$(dirname "$0")/.."
mkdir -p results
LOG=results/run-all.log
echo "RUN-ALL START $(date -u +%FT%TZ) $*" >> "$LOG"
for phase in build conformance load lighthouse interact robust code; do
  echo "PHASE $phase $(date -u +%FT%TZ)" >> "$LOG"
  node bench/run.mjs "$phase" "$@" >> "$LOG" 2>&1
done
node bench/report.mjs >> "$LOG" 2>&1
echo "RUN-ALL DONE $(date -u +%FT%TZ)" >> "$LOG"
